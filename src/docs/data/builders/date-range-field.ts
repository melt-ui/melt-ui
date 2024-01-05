import { ATTRS, KBD } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { dateRangeFieldEvents } from '$lib/builders/date-range-field/events.js';
import type { BuilderData } from './index.js';

const dateRangeFieldProps = [
	{
		name: 'defaultValue',
		type: 'DateRange | undefined',
		description:
			'The default value for the date range field. When provided the `placeholder` will assume the start date of the default value.',
	},
	{
		name: 'value',
		type: 'Writable<DateRange | undefined>',
		description:
			'A writable store than can be used to control the value of the date range field from outside the builder. Useful if you want to sync the value of the date field with another store used in your app.',
	},
	{
		name: 'onValueChange',
		type: 'ChangeFn<DateRange | undefined>',
		description:
			'A function called when the value of the date range field changes. It receives a single argument, which is an object containing `curr` and `prev` properties, whose values are the current and previous values of the value store. Whatever you return from this function will be set as the new value of the value store.',
	},
	{
		name: 'defaultPlaceholder',
		type: 'DateValue',
		default: 'CalendarDate',
		description:
			'The date that is used when the date range field is empty to determine what point in time the field should start at.',
	},
	{
		name: 'placeholder',
		type: 'Writable<DateValue>',
		description:
			'A writable store that can be used to control the placeholder date from outside the builder. When this prop is provided, the `defaultPlaceholder` prop is ignored, and the value of this store is used instead.',
	},
	{
		name: 'onPlaceholderChange',
		type: 'ChangeFn<DateValue>',
		description:
			'A function called when the placeholder value changes. It receives a single argument, which is an object containing `curr` and `prev` properties, whose values are the current and previous values of the `placeholder` store. Whatever you return from this function will be set as the new value of the `placeholder` store.',
	},
	{
		name: 'isDateUnavailable',
		type: 'Matcher | undefined',
		description:
			'A function that accepts a date and returns a boolean indicating whether the date is unavailable.',
	},
	{
		name: 'minValue',
		type: 'DateValue | undefined',
		description: 'The minimum date that can be selected.',
	},
	{
		name: 'maxValue',
		type: 'DateValue | undefined',
		description: 'The maximum date that can be selected.',
	},
	{
		name: 'disabled',
		type: 'boolean',
		default: 'false',
		description: 'Whether the date field is disabled.',
	},
	{
		name: 'readonly',
		type: 'boolean',
		default: 'false',
		description: 'Whether the date field is readonly.',
	},
	{
		name: 'readonlySegments',
		type: '{ start: EditableSegmentPart[], end: EditableSegmentPart[] }',
		description: 'The sets of segments that are readonly on the start and end fields.',
	},
	{
		name: 'hourCycle',
		type: 'HourCycle',
		description: 'The hour cycle to use when formatting the date.',
	},
	{
		name: 'locale',
		type: 'string',
		default: '"en"',
		description: 'The locale to use when formatting the date.',
	},
	{
		name: 'granularity',
		type: '"day" | "hour" | "minute" | "second"',
		description:
			'The granularity of the date range field. Defaults to `"day"` if a CalendarDate is provided, otherwise defaults to `"minute"`. The field will render segments for each part of the date up to and including the specified granularity.',
	},
	{
		name: 'name',
		type: 'string',
		description: 'The name of the hidden input element.',
	},
	{
		name: 'required',
		type: 'boolean',
		default: 'false',
		description: 'Whether the hidden input is required.',
	},
	{
		name: 'ids',
		type: 'DateRangeFieldIds',
		description:
			'Override the default ids used by the various elements within the date range field.',
	},
];

const excludedProps = ['value', 'placeholder'];
const dateRangeFieldOptions = dateRangeFieldProps.filter(
	(prop) => !excludedProps.includes(prop.name)
);

const BUILDER_NAME = 'date field';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createDateRangeField',
	props: dateRangeFieldProps,
	elements: [
		{
			name: 'field',
			description: 'The element which contains the date segments',
		},
		{
			name: 'startSegment',
			description: 'An individual segment of the start date',
		},
		{
			name: 'endSegment',
			description: 'An individual segment of the end date',
		},
		{
			name: 'label',
			description: 'The label for the date field',
		},
		{
			name: 'validation',
			description: 'The element containing the validation message',
		},
		{
			name: 'startHiddenInput',
			description: 'The hidden input used to submit the start value within a form',
		},
		{
			name: 'endHiddenInput',
			description: 'The hidden input used to submit the end value within a form',
		},
	],
	states: [
		{
			name: 'value',
			type: 'Writable<DateRange>',
			description: 'A writable store which represents the current value of the date field.',
		},
		{
			name: 'segmentValues',
			type: 'Record<"start" | "end", Writable<DateSegmentObj | DateTimeSegmentObj>>',
			description:
				'An object of writable stores containing the current values of the date segments.',
		},
		{
			name: 'segmentContents',
			type: 'Record<"start" | "end", Readable<{ part: SegmentPart; value: string; }[]>>',
			description: 'An object of readable stores used to dynamically render the date segments.',
		},
		{
			name: 'segmentContentsObj',
			type: 'Record<"start" | "end", Readable<SegmentContentsObj>>',
			description:
				'An object of readable stores containing the current values of the date segments.',
		},
		{
			name: 'placeholder',
			type: 'Writable<DateValue>',
			description: 'A writable store which represents the placeholder value of the date field.',
		},
		{
			name: 'isInvalid',
			type: 'Readable<boolean>',
			description: 'A readable store which represents whether the date field is invalid.',
		},
		{
			name: 'isDateUnavailable',
			type: 'Readable<Matcher | undefined>',
			description:
				'A readable store which returns a function that accepts a date and returns a boolean indicating whether the date is unavailable.',
		},
	],
	options: dateRangeFieldOptions,
});

const field = elementSchema('field', {
	description: 'The element which contains the date segments',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the date field is invalid.',
		},
		{
			name: 'data-disabled',
			value: 'Present when the date field is disabled.',
		},
		{
			name: 'data-melt-datefield-field',
			value: ATTRS.MELT('field'),
		},
	],
	// events: popoverEvents['trigger'],
});

const startSegment = elementSchema('startSegment', {
	description: 'The start segment for the date range field',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the field is invalid.',
		},
		{
			name: 'data-disabled',
			value: 'Present when the field is disabled.',
		},
		{
			name: 'data-segment',
			value: 'SegmentPart',
		},
		{
			name: 'data-melt-datefield-segment',
			value: ATTRS.MELT('segment'),
		},
	],
	events: dateRangeFieldEvents['startSegment'],
});

const endSegment = elementSchema('endSegment', {
	description: 'The end segment for the date range field',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the field is invalid.',
		},
		{
			name: 'data-disabled',
			value: 'Present when the field is disabled.',
		},
		{
			name: 'data-segment',
			value: 'SegmentPart',
		},
		{
			name: 'data-melt-datefield-segment',
			value: ATTRS.MELT('segment'),
		},
	],
	events: dateRangeFieldEvents['endSegment'],
});

const validation = elementSchema('validation', {
	title: 'validation',
	description: 'The element containing the validation message',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the field is invalid.',
		},
		{
			name: 'data-melt-datefield-validation',
			value: ATTRS.MELT('validation'),
		},
	],
});

const label = elementSchema('label', {
	title: 'label',
	description: 'The label for the date field',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the field is invalid.',
		},
		{
			name: 'data-melt-datefield-label',
			value: ATTRS.MELT('label'),
		},
	],
});

const startHiddenInput = elementSchema('startHiddenInput', {
	title: 'startHiddenInput',
	description: 'The hidden input for the start date field.',
	dataAttributes: [
		{
			name: 'data-melt-datefield-hiddenInput',
			value: ATTRS.MELT('hiddenInput'),
		},
	],
});

const endHiddenInput = elementSchema('endHiddenInput', {
	title: 'endHiddenInput',
	description: 'The hidden input for the start date field.',
	dataAttributes: [
		{
			name: 'data-melt-datefield-hiddenInput',
			value: ATTRS.MELT('hiddenInput'),
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.TAB,
		behavior:
			'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior:
			'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the popover and moves focus to the trigger element.',
	},
];

const schemas = [
	builder,
	field,
	startSegment,
	endSegment,
	label,
	validation,
	startHiddenInput,
	endHiddenInput,
];

const features = [
	'Full keyboard navigation',
	'Localization support',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Accessible by default',
	'Supports both date and date-time formats',
];

export const dateRangeFieldData: BuilderData = {
	schemas,
	features,
	keyboard,
};
