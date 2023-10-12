import type { CreateDateRangeFieldProps } from './types.js';
import {
	builder,
	createElHelpers,
	generateId,
	overridable,
	toWritableStores,
	omit,
	effect,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDefaultDate,
	getAnnouncer,
	isBefore,
} from '$lib/internal/helpers/date/index.js';
import { derived, get, writable } from 'svelte/store';
import { removeDescriptionElement } from './_internal/helpers.js';
import { createDateField } from '$lib/index.js';
import type { DateValue } from '@internationalized/date';

const defaults = {
	isUnavailable: undefined,
	value: undefined,
	hourCycle: undefined,
	locale: 'en',
	granularity: undefined,
	hideTimeZone: false,
	defaultValue: {
		start: undefined,
		end: undefined,
	},
} satisfies CreateDateRangeFieldProps;

type DateFieldParts = 'segment' | 'label';

const { name } = createElHelpers<DateFieldParts>('dateField');

export function createDateRangeField(props?: CreateDateRangeFieldProps) {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(omit(withDefaults, 'value', 'placeholderValue'));

	const ids = {
		field: generateId(),
		label: generateId(),
		description: generateId(),
	};

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholderValue: withDefaults.defaultPlaceholderValue,
		granularity: withDefaults.granularity,
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const startValue = writable<DateValue | undefined>(withDefaults.defaultValue?.start);
	const endValue = writable<DateValue | undefined>(withDefaults.defaultValue?.end);

	const isCompleted = derived(value, ($value) => {
		return $value?.start && $value?.end;
	});

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.defaultPlaceholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const startField = createDateField({
		...omit(withDefaults, 'defaultValue', 'onValueChange'),
		value: startValue,
		ids,
	});

	const endField = createDateField({
		...omit(withDefaults, 'defaultValue', 'onValueChange'),
		value: endValue,
		ids,
	});

	const {
		elements: { segment: startSegment },
		states: {
			isFieldInvalid: isStartInvalid,
			segmentContents: startSegmentContents,
			segmentValues: startSegmentValues,
		},
	} = startField;
	const {
		elements: { segment: endSegment },
		states: {
			isFieldInvalid: isEndInvalid,
			segmentContents: endSegmentContents,
			segmentValues: endSegmentValues,
		},
	} = endField;

	const isFieldInvalid = derived(
		[value, isStartInvalid, isEndInvalid],
		([$value, $isStartInvalid, $isEndInvalid]) => {
			if ($isStartInvalid || $isEndInvalid) {
				return true;
			}
			if ($value.start && $value.end) {
				return isBefore($value.end, $value.start);
			}
			return false;
		}
	);

	const label = builder(name('label'), {
		returned: () => {
			return {
				id: ids.label,
			};
		},
	});

	const dateField = builder(name(), {
		stores: [isCompleted, isFieldInvalid],
		returned: ([$isCompleted, $isFieldInvalid]) => {
			return {
				role: 'group',
				id: ids.field,
				'aria-labelledby': ids.label,
				'aria-describedby': $isCompleted ? ids.description : undefined,
				'data-invalid': $isFieldInvalid ? '' : undefined,
			};
		},
		action: () => {
			getAnnouncer();
			return {
				destroy() {
					removeDescriptionElement(ids.description);
				},
			};
		},
	});

	/**
	 * Combine the `startSegmentContents` and `endSegmentContents` stores
	 * into a single store that can be used to render the contents of the
	 * date range field.
	 *
	 * Since contents are generated automatically based on the locale
	 * and granularity props, this is not a writable store. If you wish
	 * to control the contents of the field, you should use the
	 * `startSegmentValues` and `endSegmentValues` stores returned
	 * from this builder instead.
	 */
	const segmentContents = derived(
		[startSegmentContents, endSegmentContents],
		([$startSegmentContents, $endSegmentContents]) => {
			return {
				start: $startSegmentContents,
				end: $endSegmentContents,
			};
		}
	);

	/**
	 * Synchronize the `value` store with the individual `startValue`
	 * and `endValue` stores that are used by the individual date fields.
	 *
	 * We only want to update the `value` store when both the `startValue`
	 * and `endValue` stores are not `undefined`. This is because the
	 * `value` store is used to determine if the date field is completed,
	 * and we don't want to mark the date field as completed until both
	 * the start and end dates have been selected.
	 */

	effect([value], ([$value]) => {
		const $startValue = get(startValue);
		const $endValue = get(endValue);

		if ($value?.start && $value?.end) {
			if ($value.start !== $startValue) {
				startValue.set($value.start);
			}
			if ($value.end !== $endValue) {
				endValue.set($value.end);
			}
			return;
		}
	});

	effect([startValue, endValue], ([$startValue, $endValue]) => {
		if ($startValue && $endValue) {
			valueWritable.update((prev) => {
				if (prev?.start === $startValue && prev?.end === $endValue) {
					return prev;
				}
				return {
					start: $startValue,
					end: $endValue,
				};
			});
		} else {
			valueWritable.set({
				start: undefined,
				end: undefined,
			});
		}
	});

	return {
		elements: {
			dateField,
			label,
			startSegment,
			endSegment,
		},
		states: {
			value,
			placeholderValue: placeholderValue.toWritable(),
			segmentContents,
			endSegmentValues,
			startSegmentValues,
			isFieldInvalid,
		},
		options,
		ids,
	};
}
