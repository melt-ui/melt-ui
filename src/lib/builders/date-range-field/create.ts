import type { CreateDateRangeFieldProps } from './types.js';
import {
	builder,
	createElHelpers,
	generateId,
	overridable,
	toWritableStores,
	omit,
} from '$lib/internal/helpers/index.js';
import {
	dateStore,
	getDefaultDate,
	getAnnouncer,
	isBefore,
	defaultMatcher,
} from '$lib/internal/date/index.js';
import { derived, writable } from 'svelte/store';
import { removeDescriptionElement } from './_internal/helpers.js';
import { createDateField } from '$lib/index.js';

const defaults = {
	isUnavailable: defaultMatcher,
	startValue: undefined,
	endValue: undefined,
	hourCycle: undefined,
	locale: 'en',
	granularity: undefined,
	hideTimeZone: false,
	defaultStartValue: undefined,
	defaultEndValue: undefined,
} satisfies CreateDateRangeFieldProps;

type DateFieldParts = 'segment' | 'label';

const { name } = createElHelpers<DateFieldParts>('dateField');

export function createDateRangeField(props?: CreateDateRangeFieldProps) {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(
		omit(withDefaults, 'startValue', 'endValue', 'placeholderValue')
	);

	const ids = {
		field: generateId(),
		label: generateId(),
		description: generateId(),
	};

	const defaultDate = withDefaults.defaultStartValue
		? withDefaults.defaultStartValue
		: withDefaults.defaultPlaceholderValue
		? withDefaults.defaultPlaceholderValue
		: getDefaultDate(withDefaults.granularity);

	const startValueWritable = withDefaults.startValue ?? writable(withDefaults.defaultStartValue);
	const startValue = overridable(startValueWritable, withDefaults.onStartValueChange);
	const endValueWritable = withDefaults.endValue ?? writable(withDefaults.defaultEndValue);
	const endValue = overridable(endValueWritable, withDefaults.onEndValueChange);

	const rangeValue = derived([startValue, endValue], ([$startValue, $endValue]) => {
		return {
			start: $startValue,
			end: $endValue,
		};
	});

	const isCompleted = derived(rangeValue, ($rangeValue) => {
		return $rangeValue.start && $rangeValue.end;
	});

	const placeholderValueWritable =
		withDefaults.placeholderValue ?? writable(withDefaults.defaultPlaceholderValue ?? defaultDate);
	const placeholderValue = dateStore(
		overridable(placeholderValueWritable, withDefaults.onPlaceholderValueChange),
		withDefaults.defaultPlaceholderValue ?? defaultDate
	);

	const startField = createDateField({
		...withDefaults,
		value: startValue,
		ids,
	});

	const endField = createDateField({
		...withDefaults,
		value: endValue,
		ids,
	});

	const {
		states: { isFieldInvalid: isStartInvalid },
	} = startField;
	const {
		states: { isFieldInvalid: isEndInvalid },
	} = endField;

	const isFieldInvalid = derived(
		[rangeValue, isStartInvalid, isEndInvalid],
		([$rangeValue, $isStartInvalid, $isEndInvalid]) => {
			if ($isStartInvalid || $isEndInvalid) {
				return true;
			}
			if ($rangeValue.start && $rangeValue.end) {
				return isBefore($rangeValue.end, $rangeValue.start);
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

	return {
		elements: {
			dateField,
			label,
			startSegment: startField.elements.segment,
			endSegment: endField.elements.segment,
		},
		states: {
			rangeValue,
			startValue,
			endValue,
			placeholderValue: placeholderValue.toWritable(),
			startSegmentContents: startField.states.segmentContents,
			endSegmentContents: endField.states.segmentContents,
			isFieldInvalid,
		},
		options,
		ids,
	};
}
