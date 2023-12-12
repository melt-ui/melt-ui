import { ATTRS, KBD } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { rangeCalendarEvents } from '$lib/builders/range-calendar/events.js';
import type { BuilderData } from './index.js';

const rangeCalendarProps = [
	{
		name: 'defaultValue',
		type: 'DateRange | undefined',
		description:
			'The default value for the calendar. When provided the `placeholder` will also assume this value.',
	},
	{
		name: 'value',
		type: 'Writable<DateRange | undefined>',
		description:
			'A writable store than can be used to control the value of the calendar from outside the builder. Useful if you want to sync the value of the calendar with another store used in your app.',
	},
	{
		name: 'onValueChange',
		type: 'ChangeFn<DateRange | undefined>',
		description:
			'A function called when the value of the calendar changes. It receives a single argument, which is an object containing `curr` and `prev` properties, whose values are the current and previous values of the value store. Whatever you return from this function will be set as the new value of the value store.',
	},
	{
		name: 'defaultPlaceholder',
		type: 'DateValue',
		default: 'CalendarDate',
		description:
			'The date that is used when the calendar is empty to determine what point in time the calendar should start at.',
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
		type: 'RangeCalendarIds',
		description: 'Override the default ids used by the various elements within the calendar.',
	},
];

const excludedProps = ['value', 'placeholder'];
const calendarOptions = rangeCalendarProps.filter((prop) => !excludedProps.includes(prop.name));

const BUILDER_NAME = 'calendar';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createRangeCalendar',
	props: rangeCalendarProps,
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
	],
	states: [
		{
			name: 'value',
			type: 'Writable<DateRange>',
			description: 'A writable store which represents the current value of the range calendar.',
		},
		{
			name: 'months',
			type: 'Readable<Month[]>',
			description: 'A readable store containing month objects for each month in the calendar.',
		},
		{
			name: 'weekdays',
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
			name: 'placeholder',
			type: 'Writable<DateValue>',
			description: 'A writable store which represents the placeholder value of the calendar.',
		},
		{
			name: 'startValue',
			type: 'Readable<DateValue | undefined>',
			description:
				'A readable store containing the current start value of the calendar, which can exist before the actual `value` is set which requires both a start and end value.',
		},
		{
			name: 'endValue',
			type: 'Readable<DateValue | undefined>',
			description:
				'A readable store containing the current end value of the calendar, which can exist before the actual `value` is set which requires both a start and end value.',
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

const calendar = elementSchema('calendar', {
	description: 'The container of the months and days of the calendar',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the calendar is invalid.',
		},
		{
			name: 'data-disabled',
			value: 'Present when the calendar is disabled.',
		},
		{
			name: 'data-readonly',
			value: 'Present when the calendar is readonly.',
		},
		{
			name: 'data-melt-calendar',
			value: ATTRS.MELT('calendar'),
		},
	],
	events: rangeCalendarEvents['calendar'],
});

const heading = elementSchema('heading', {
	description: 'A visual heading for the calendar',
	dataAttributes: [
		{
			name: 'data-invalid',
			value: 'Present when the calendar is invalid.',
		},
		{
			name: 'data-disabled',
			value: 'Present when the calendar is disabled.',
		},
		{
			name: 'data-melt-calendar-heading',
			value: ATTRS.MELT('heading'),
		},
	],
});

const grid = elementSchema('grid', {
	description: 'A grid representing a month of the calendar',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: 'Present when the calendar is disabled.',
		},
		{
			name: 'data-melt-calendar-grid',
			value: ATTRS.MELT('grid'),
		},
	],
});

const prevButton = elementSchema('prevButton', {
	description: 'A button which moves the calendar to the previous page',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: 'Present when the calendar is disabled.',
		},
		{
			name: 'data-melt-calendar-prevButton',
			value: ATTRS.MELT('prevButton'),
		},
	],
	events: rangeCalendarEvents['prevButton'],
});

const nextButton = elementSchema('nextButton', {
	description: 'A button which moves the calendar to the next page',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: 'Present when the calendar is disabled.',
		},
		{
			name: 'data-melt-calendar-nextButton',
			value: ATTRS.MELT('nextButton'),
		},
	],
	events: rangeCalendarEvents['nextButton'],
});

const cell = elementSchema('cell', {
	description: 'A cell representing a single date in the calendar',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: 'Present when the date is disabled.',
		},
		{
			name: 'data-selected',
			value: 'Present when the date is selected.',
		},
		{
			name: 'data-value',
			value: 'The ISO string value of the date.',
		},
		{
			name: 'data-unavailable',
			value: 'Present when the date is unavailable.',
		},
		{
			name: 'data-today',
			value: 'Present when the date is today.',
		},
		{
			name: 'data-outside-month',
			value: 'Present when the date is outside the current month it is displayed in.',
		},
		{
			name: 'data-outside-visible-months',
			value: 'Present when the date is outside the months that are visible on the calendar.',
		},
		{
			name: 'data-selection-start',
			value: 'Present when the date is the start of the selection.',
		},
		{
			name: 'data-selection-end',
			value: 'Present when the date is the end of the selection.',
		},
		{
			name: 'data-highlighted',
			value: 'Present when the date is highlighted by the user as they select a range.',
		},
		{
			name: 'data-focused',
			value: 'Present when the date is focused.',
		},
		{
			name: 'data-melt-calendar-cell',
			value: ATTRS.MELT('cell'),
		},
	],
	events: rangeCalendarEvents['cell'],
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

const schemas = [builder, calendar, grid, cell, heading, prevButton, nextButton];

const features = [
	'Full keyboard navigation',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Localization support',
	'Highly composable',
];

export const rangeCalendarData: BuilderData = {
	schemas,
	features,
	keyboard,
};
