import { KBD } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';
import { dateFieldData } from './date-field.js';
import { rangeCalendarData } from './range-calendar.js';
import { popoverData } from './popover.js';

const dateRangePickerProps = [
	{
		name: 'defaultValue',
		type: 'DateRange | undefined',
		description:
			'The default value for the date picker. When provided the `placeholder` will also assume this value.',
	},
	{
		name: 'value',
		type: 'Writable<DateRange | undefined>',
		description:
			'A writable store than can be used to control the value of the date picker from outside the builder. Useful if you want to sync the value of the date picker with another store used in your app.',
	},
	{
		name: 'onValueChange',
		type: 'ChangeFn<DateRange | undefined>',
		description:
			'A function called when the value of the date picker changes. It receives a single argument, which is an object containing `curr` and `prev` properties, whose values are the current and previous values of the value store. Whatever you return from this function will be set as the new value of the value store.',
	},
	{
		name: 'defaultPlaceholder',
		type: 'DateValue',
		default: 'CalendarDate',
		description:
			'The date that is used when the date picker is empty to determine what point in time the calendar should start at.',
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
		description: 'Whether the calendar is disabled.',
	},
	{
		name: 'readonly',
		type: 'boolean',
		default: 'false',
		description: 'Whether the calendar is readonly.',
	},
	{
		name: 'locale',
		type: 'string',
		default: '"en"',
		description: 'The locale to use when formatting the date.',
	},
	{
		name: 'pagedNavigation',
		type: 'boolean',
		default: 'false',
		description: 'Whether to use paged navigation for the calendar.',
	},
	{
		name: 'weekStartsOn',
		type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
		default: '0',
		description: 'The day of the week the calendar starts on. 0 is Sunday, 6 is Saturday, etc.',
	},
	{
		name: 'fixedWeeks',
		type: 'boolean',
		default: 'false',
		description: 'Whether to always show 6 weeks in the calendar.',
	},
	{
		name: 'calendarLabel',
		type: 'string',
		default: '"Event date"',
		description: 'An accessible label for the calendar.',
	},
	{
		name: 'ids',
		type: 'DateRangePickerIds',
		description: 'Override the default ids used by the various elements within the date picker.',
	},
];

const excludedProps = ['value', 'placeholder'];
const calendarOptions = dateRangePickerProps.filter((prop) => !excludedProps.includes(prop.name));

const BUILDER_NAME = 'calendar';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createDateRangePicker',
	props: dateRangePickerProps,
	elements: [
		{
			name: 'calendar',
			description: 'The container of the months and days of the calendar',
		},
		{
			name: 'heading',
			description: 'A visual heading for the calendar',
		},
		{
			name: 'grid',
			description: 'A grid representing a month of the calendar',
		},
		{
			name: 'cell',
			description: 'A cell representing a single date in the calendar',
		},
		{
			name: 'nextButton',
			description: 'A button which moves the calendar to the next page',
		},
		{
			name: 'prevButton',
			description: 'A button which moves the calendar to the previous page',
		},
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
			description: 'A writable store which represents the current value of the calendar.',
		},
		{
			name: 'months',
			type: 'Readable<Month[]>',
			description: 'A readable store containing month objects for each month in the calendar.',
		},
		{
			name: 'daysOfWeek',
			type: 'Readable<string[]>',
			description:
				'A readable store containing the days of the week, formatted to the  `locale` prop.',
		},
		{
			name: 'headingValue',
			type: 'Readable<string>',
			description:
				'A readable store containing the heading for the calendar, formatted to the `locale` prop.',
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
			description: 'A writable store which represents the placeholder value of the calendar.',
		},
		{
			name: 'isInvalid',
			type: 'Readable<boolean>',
			description: 'A readable store which represents whether the calendar is invalid.',
		},
	],
	options: calendarOptions,
	helpers: [
		{
			name: 'nextPage',
			description: 'A function that moves the calendar to the next page.',
		},
		{
			name: 'prevPage',
			description: 'A function that moves the calendar to the previous page.',
		},
		{
			name: 'nextYear',
			description: 'A function that moves the calendar to the next year.',
		},
		{
			name: 'prevYear',
			description: 'A function that moves the calendar to the previous year.',
		},
		{
			name: 'setYear',
			description: 'A function that sets the year of the calendar.',
			type: '(year: number) => void',
		},
		{
			name: 'setMonth',
			description: 'A function that sets the month of the calendar.',
			type: '(month: number) => void',
		},
		{
			name: 'isDateDisabled',
			description: 'A function that returns whether the given date is disabled.',
			type: 'Readable<(date: DateValue) => boolean>',
		},
		{
			name: 'isDateUnavailable',
			description: 'A function that returns whether the given date is unavailable.',
			type: 'Readable<(date: DateValue) => boolean>',
		},
		{
			name: 'isDateSelected',
			description: 'A function that returns whether the given date is selected.',
			type: 'Readable<(date: DateValue) => boolean>',
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

function getDateFieldSchemas() {
	if (!dateFieldData.schemas) return [];
	return dateFieldData.schemas.filter((schema) => !schema.isBuilder);
}

function getRangeCalendarSchemas() {
	if (!rangeCalendarData.schemas) return [];
	return rangeCalendarData.schemas.filter((schema) => !schema.isBuilder);
}

function getPopoverSchemas() {
	if (!popoverData.schemas) return [];
	return popoverData.schemas.filter((schema) => !schema.isBuilder);
}

const schemas = [
	builder,
	...getRangeCalendarSchemas(),
	...getDateFieldSchemas(),
	...getPopoverSchemas(),
];

const features = [
	'Full keyboard navigation',
	'Localization support',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Supports both date and date-time formats',
];

export const dateRangePickerData: BuilderData = {
	schemas,
	features,
	keyboard,
};
