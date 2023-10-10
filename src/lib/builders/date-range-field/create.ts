import type { CreateDateRangeFieldProps } from './types';
import {
	builder,
	createElHelpers,
	generateId,
	overridable,
	toWritableStores,
	omit,
	type ChangeFn,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDefaultDate,
	getAnnouncer,
	isMatch,
	isBefore,
} from '$lib/internal/date/index.js';
import { derived, writable } from 'svelte/store';
import { removeDescriptionElement } from './_internal/helpers.js';
import { createDateField } from '..';
import type { DateValue } from '@internationalized/date';

const defaults = {
	unavailable: false,
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
	const nonConflictingOptions = omit(withDefaults, 'onValueChange', 'value', 'defaultValue');

	const { unavailable } = options;

	const ids = {
		field: generateId(),
		label: generateId(),
		description: generateId(),
	};

	const defaultDate = getDefaultDate(withDefaults.granularity);
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults.onValueChange);

	const isInvalid = derived([value, unavailable], ([$value, $unavailable]) => {
		let invalid = false;
		if ($value?.start) {
			if (isMatch($value?.start, $unavailable)) {
				invalid = true;
			}
		}

		if ($value?.end) {
			if (isMatch($value?.end, $unavailable)) {
				invalid = true;
			}
		}

		if ($value?.start && $value?.end) {
			if (isBefore($value.end, $value.start)) {
				invalid = true;
			}
		}

		return invalid;
	});

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.defaultPlaceholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const startOnValueChange: ChangeFn<DateValue | undefined> = ({ next }) => {
		value.update((prev) => {
			return {
				...prev,
				start: next,
			};
		});
		return next;
	};

	const endOnValueChange: ChangeFn<DateValue | undefined> = ({ next }) => {
		value.update((prev) => {
			return {
				...prev,
				end: next,
			};
		});
		return next;
	};

	const startField = createDateField({
		...nonConflictingOptions,
		defaultValue: withDefaults.defaultValue?.start,
		ids,
		onValueChange: startOnValueChange,
	});

	const endField = createDateField({
		...nonConflictingOptions,
		defaultValue: withDefaults.defaultValue?.end,
		ids,
		onValueChange: endOnValueChange,
	});

	const label = builder(name('label'), {
		returned: () => {
			return {
				id: ids.label,
			};
		},
	});

	const dateField = builder(name(), {
		stores: [value, isInvalid],
		returned: ([$value, $isInvalid]) => {
			return {
				role: 'group',
				id: ids.field,
				'aria-labelledby': ids.label,
				'aria-describedby': $value ? ids.description : undefined,
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

	return {
		elements: {
			dateField,
			label,
			startSegment: startField.elements.segment,
			endSegment: endField.elements.segment,
		},
		states: {
			value,
			placeholderValue: placeholderValue.toWritable(),
			startSegmentContents: startField.states.segmentContents,
			endSegmentContents: endField.states.segmentContents,
			isInvalid,
		},
		options,
		ids,
	};
}
