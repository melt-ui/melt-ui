import type { CreateDateRangeFieldProps } from './types.js';
import {
	builder,
	createElHelpers,
	generateId,
	overridable,
	toWritableStores,
	omit,
	effect,
	styleToString,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDefaultDate,
	getAnnouncer,
	isBefore,
	areAllDaysBetweenValid,
} from '$lib/internal/helpers/date/index.js';
import { derived, get, writable } from 'svelte/store';
import { removeDescriptionElement } from './_internal/helpers.js';
import { createDateField } from '$lib/index.js';
import type { DateValue } from '@internationalized/date';

const defaults = {
	isDateUnavailable: undefined,
	value: undefined,
	hourCycle: undefined,
	locale: 'en',
	granularity: undefined,
	hideTimeZone: false,
	defaultValue: {
		start: undefined,
		end: undefined,
	},
	startName: undefined,
	endName: undefined,
} satisfies CreateDateRangeFieldProps;

type DateFieldParts = 'segment' | 'label' | 'field' | 'validation';

const { name } = createElHelpers<DateFieldParts>('dateField');

export function createDateRangeField(props?: CreateDateRangeFieldProps) {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(omit(withDefaults, 'value', 'placeholder'));

	const ids = {
		field: generateId(),
		label: generateId(),
		description: generateId(),
		validation: generateId(),
	};

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		granularity: withDefaults.granularity,
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const startValue = writable<DateValue | undefined>(withDefaults.defaultValue?.start);
	const endValue = writable<DateValue | undefined>(withDefaults.defaultValue?.end);

	const isCompleted = derived(value, ($value) => {
		return $value?.start && $value?.end;
	});

	const placeholderWritable =
		withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
	const placeholder = dateStore(
		overridable(placeholderWritable, withDefaults.onPlaceholderChange),
		withDefaults.defaultPlaceholder ?? defaultDate
	);

	const startField = createDateField({
		...omit(withDefaults, 'defaultValue', 'onValueChange', 'startName', 'endName'),
		value: startValue,
		name: withDefaults.startName,
		ids,
	});

	const endField = createDateField({
		...omit(withDefaults, 'defaultValue', 'onValueChange', 'endName', 'startName'),
		value: endValue,
		name: withDefaults.endName,
		ids,
	});

	const {
		elements: { segment: startSegment, hiddenInput: startHiddenInput },
		states: {
			isInvalid: isStartInvalid,
			segmentContents: startSegmentContents,
			segmentValues: startSegmentValues,
		},
		options: { name: startName },
	} = startField;
	const {
		elements: { segment: endSegment, hiddenInput: endHiddenInput },
		states: {
			isInvalid: isEndInvalid,
			segmentContents: endSegmentContents,
			segmentValues: endSegmentValues,
		},
		options: { name: endName },
	} = endField;

	const isInvalid = derived(
		[value, isStartInvalid, isEndInvalid, options.isDateUnavailable],
		([$value, $isStartInvalid, $isEndInvalid, $isDateUnavailable]) => {
			if ($isStartInvalid || $isEndInvalid) {
				return true;
			}
			if (!$value.start || !$value.end) {
				return false;
			}

			if (!isBefore($value.start, $value.end)) {
				return true;
			}

			if ($isDateUnavailable !== undefined) {
				const allValid = areAllDaysBetweenValid(
					$value.start,
					$value.end,
					$isDateUnavailable,
					undefined
				);
				if (!allValid) {
					return true;
				}
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

	const field = builder(name('field'), {
		stores: [isCompleted, isInvalid],
		returned: ([$isCompleted, $isInvalid]) => {
			return {
				role: 'group',
				id: ids.field,
				'aria-labelledby': ids.label,
				'aria-describedby': $isCompleted ? ids.description : undefined,
				'data-invalid': $isInvalid ? '' : undefined,
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

	const validation = builder(name('validation'), {
		stores: [isInvalid],
		returned: ([$isInvalid]) => {
			const validStyle = styleToString({
				display: 'none',
			});

			return {
				id: ids.validation,
				'data-invalid': $isInvalid ? '' : undefined,
				style: $isInvalid ? undefined : validStyle,
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
			field,
			label,
			startSegment,
			endSegment,
			startHiddenInput,
			endHiddenInput,
			validation,
		},
		states: {
			value,
			placeholder: placeholder.toWritable(),
			segmentContents,
			endSegmentValues,
			startSegmentValues,
			isInvalid,
		},
		options: {
			...options,
			endName,
			startName,
		},
		ids,
	};
}
