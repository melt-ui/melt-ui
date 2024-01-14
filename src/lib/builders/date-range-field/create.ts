import type { CreateDateRangeFieldProps } from './types.js';
import {
	builder,
	createElHelpers,
	generateIds,
	overridable,
	toWritableStores,
	omit,
	effect,
	styleToString,
	executeCallbacks,
	addMeltEventListener,
	sleep,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDefaultDate,
	getAnnouncer,
	isBefore,
	areAllDaysBetweenValid,
	getFirstSegment,
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
	disabled: false,
	readonly: false,
	minValue: undefined,
	maxValue: undefined,
} satisfies CreateDateRangeFieldProps;

type DateFieldParts = 'segment' | 'label' | 'field' | 'validation';
const { name } = createElHelpers<DateFieldParts>('dateField');

const rangeFieldIdParts = ['field', 'label', 'description', 'validation'] as const;
export type DateRangeFieldIdParts = typeof rangeFieldIdParts;

export function createDateRangeField(props?: CreateDateRangeFieldProps) {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(omit(withDefaults, 'value', 'placeholder'));

	const generatedIds = generateIds(rangeFieldIdParts);

	const ids = toWritableStores({ ...generatedIds, ...withDefaults.ids });

	const defaultDate = getDefaultDate({
		defaultValue: withDefaults.defaultValue?.start,
		defaultPlaceholder: withDefaults.defaultPlaceholder,
		granularity: withDefaults.granularity,
	});

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const defaultStart = withDefaults.value ? get(withDefaults.value)?.start : undefined;
	const startValue = writable<DateValue | undefined>(
		defaultStart ?? withDefaults.defaultValue?.start
	);
	const defaultEnd = withDefaults.value ? get(withDefaults.value)?.end : undefined;
	const endValue = writable<DateValue | undefined>(defaultEnd ?? withDefaults.defaultValue?.end);

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
		ids: {
			...generatedIds,
			...withDefaults.ids,
			...withDefaults.startIds,
		},
	});

	const endField = createDateField({
		...omit(withDefaults, 'defaultValue', 'onValueChange', 'endName', 'startName'),
		value: endValue,
		name: withDefaults.endName,
		ids: {
			...generatedIds,
			...withDefaults.ids,
			...withDefaults.endIds,
		},
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
			if (!$value?.start || !$value?.end) {
				return false;
			}

			if (!isBefore($value?.start, $value?.end)) {
				return true;
			}

			if ($isDateUnavailable !== undefined) {
				const allValid = areAllDaysBetweenValid(
					$value?.start,
					$value?.end,
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
		stores: [isInvalid, options.disabled, ids.label],
		returned: ([$isInvalid, $disabled, $labelId]) => {
			return {
				id: $labelId,
				'data-invalid': $isInvalid ? '' : undefined,
				'data-disabled': $disabled ? '' : undefined,
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const firstSegment = getFirstSegment(get(ids.field));
					if (!firstSegment) return;
					sleep(1).then(() => firstSegment.focus());
				}),
				addMeltEventListener(node, 'mousedown', (e) => {
					if (!e.defaultPrevented && e.detail > 1) {
						e.preventDefault();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const fieldIdDeps = derived(
		[ids.field, ids.label, ids.description, ids.validation],
		([$fieldId, $labelId, $descriptionId, $validationId]) => {
			return {
				field: $fieldId,
				label: $labelId,
				description: $descriptionId,
				validation: $validationId,
			};
		}
	);

	const field = builder(name('field'), {
		stores: [isCompleted, isInvalid, fieldIdDeps],
		returned: ([$isCompleted, $isInvalid, $ids]) => {
			const describedBy = $isCompleted
				? `${$ids.description}${$isInvalid ? ` ${$ids.validation}` : ''}`
				: `${$ids.description}`;

			return {
				role: 'group',
				id: $ids.field,
				'aria-labelledby': $ids.label,
				'aria-describedby': describedBy,
				'data-invalid': $isInvalid ? '' : undefined,
			};
		},
		action: () => {
			getAnnouncer();
			return {
				destroy() {
					removeDescriptionElement(get(ids.description));
				},
			};
		},
	});

	const validation = builder(name('validation'), {
		stores: [isInvalid, ids.validation],
		returned: ([$isInvalid, $validationId]) => {
			const validStyle = styleToString({
				display: 'none',
			});

			return {
				id: $validationId,
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
		const $value = get(value);

		if ($value && $value?.start === $startValue && $value?.end === $endValue) return;

		if ($startValue && $endValue) {
			value.update((prev) => {
				if (prev?.start === $startValue && prev?.end === $endValue) {
					return prev;
				}
				return {
					start: $startValue,
					end: $endValue,
				};
			});
		} else if ($value && $value?.start && $value?.end) {
			value.set({
				start: undefined,
				end: undefined,
			});
		}
	});

	effect([options.disabled], ([$disabled]) => {
		startField.options.disabled.set($disabled);
		endField.options.disabled.set($disabled);
	});
	effect([options.readonly], ([$readonly]) => {
		startField.options.readonly.set($readonly);
		endField.options.readonly.set($readonly);
	});
	effect([options.minValue], ([$minValue]) => {
		startField.options.minValue.set($minValue);
		endField.options.minValue.set($minValue);
	});
	effect([options.maxValue], ([$maxValue]) => {
		startField.options.maxValue.set($maxValue);
		endField.options.maxValue.set($maxValue);
	});
	effect([options.granularity], ([$granularity]) => {
		startField.options.granularity.set($granularity);
		endField.options.granularity.set($granularity);
	});
	effect([options.hideTimeZone], ([$hideTimeZone]) => {
		startField.options.hideTimeZone.set($hideTimeZone);
		endField.options.hideTimeZone.set($hideTimeZone);
	});
	effect([options.hourCycle], ([$hourCycle]) => {
		startField.options.hourCycle.set($hourCycle);
		endField.options.hourCycle.set($hourCycle);
	});
	effect([options.locale], ([$locale]) => {
		startField.options.locale.set($locale);
		endField.options.locale.set($locale);
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
		ids: {
			field: ids,
			start: startField.ids,
			end: endField.ids,
		},
	};
}
