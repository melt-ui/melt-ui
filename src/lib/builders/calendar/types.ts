import type { Matcher } from '$lib/index.js';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { DateValue } from '@internationalized/date';
import type { Writable } from 'svelte/store';
import type { CalendarIdParts, createCalendar } from './create.js';

export type CreateCalendarProps<Value extends DateValue = DateValue> = {
	/**
	 * Prevent deselecting the selected date(s), which would set the
	 * value to `undefined`. You can use this to ensure a date
	 * is always selected in certain situations.
	 *
	 * @default false
	 */
	preventDeselect?: ReadableProp<boolean>;

	/**
	 * The minimum selectable date. When provided, the
	 * calendar will not shift to a month before this date,
	 * and all dates before this date will be disabled.
	 *
	 * @default undefined
	 */
	minValue?: ReadableProp<DateValue>;

	/**
	 * The maximum selectable date. When provided, the
	 * calendar will not shift to a month after this date,
	 * and all dates before this date will be disabled.
	 *
	 * @default undefined
	 */
	maxValue?: ReadableProp<DateValue>;

	/**
	 * The value for the date picker. When provided,
	 * the `placeholder` will assume this value so the calendar
	 * will open to the month/year of this value.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<Value[]>;

	/**
	 * The date that is used to display the initial month and
	 * year of the calendar. When a `value`	prop containing a
	 * date is provided, this prop is ignored.
	 *
	 * It is useful when you want to display a specific month
	 * and year when the calendar is first opened, but you don't
	 * necessarily want to set the value of the date picker to
	 * that date.
	 *
	 * @default CalendarDate - the current date at midnight.
	 */
	placeholder?: ReadableProp<DateValue>;

	/**
	 * Applicable only when `numberOfMonths` is greater than 1.
	 *
	 * Controls whether to use paged navigation for the next and previous buttons in the
	 * date picker. With paged navigation set to `true`, clicking the next/prev buttons
	 * changes all months in view. When set to `false`, it shifts the view by a single month.
	 *
	 * For example, with `pagedNavigation` set to `true` and 2 months displayed (January and
	 * February), clicking the next button changes the view to March and April. If `pagedNavigation`
	 * is `false`, the view shifts to February and March.
	 *
	 * @default false
	 */
	pagedNavigation?: ReadableProp<boolean>;

	/**
	 * The day of the week to start the calendar on, which must
	 * be a number between 0 and 6, where 0 is Sunday and 6 is
	 * Saturday.
	 *
	 * @defaultValue 0 (Sunday)
	 */
	weekStartsOn?: ReadableProp<0 | 1 | 2 | 3 | 4 | 5 | 6>;

	/**
	 * How the string representation of the weekdays provided via the `weekdays` state store
	 * should be formatted.
	 *
	 * ```md
	 * - "long": "Sunday", "Monday", "Tuesday", etc.
	 * - "short": "Sun", "Mon", "Tue", etc.
	 * - "narrow": "S", "M", "T", etc.
	 *```
	 *
	 * @default "narrow"
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#weekday
	 */
	weekdayFormat?: ReadableProp<Intl.DateTimeFormatOptions['weekday']>;

	/**
	 * A function that receives a date and returns `true` or `false` to indicate whether
	 * the date is disabled.
	 *
	 * @remarks
	 * Disabled dates cannot be focused or selected. Additionally, they are tagged
	 * with a data attribute to enable custom styling.
	 *
	 * `[data-disabled]` - applied to disabled dates
	 *
	 * @default undefined
	 */
	isDateDisabled?: ReadableProp<Matcher>;

	/**
	 * Dates matching the provided matchers are marked as "unavailable." Unlike disabled dates,
	 * users can still focus and select unavailable dates. However, selecting an unavailable date
	 * renders the date picker as invalid.
	 *
	 * For example, in a calendar for booking appointments, you might mark already booked dates as
	 * unavailable. These dates could become available again before the appointment date, allowing
	 * users to select them to learn more about the appointment.
	 *
	 * `[data-unavailable]` - applied to unavailable dates
	 *
	 * @default undefined
	 */
	isDateUnavailable?: ReadableProp<Matcher>;

	/**
	 * Display 6 weeks per month, regardless the month's number of weeks.
	 * This is useful for displaying a consistent calendar, where the size
	 * of the calendar doesn't change month to month.
	 *
	 * To display 6 weeks per month, you will need to render out the previous
	 * and next month's dates in the calendar as well.
	 *
	 * @default false
	 */
	fixedWeeks?: ReadableProp<boolean>;

	/**
	 * Determines the number of months to display on the calendar simultaneously.
	 * For navigation between months, refer to the `pagedNavigation` prop.
	 *
	 * @default 1
	 */
	numberOfMonths?: ReadableProp<number>;

	/**
	 * This label is exclusively used for accessibility, remaining hidden from the page.
	 * It's read by screen readers when the calendar is opened. The current month and year
	 * are automatically appended to the label, so you only need to provide the base label.
	 *
	 * For instance:
	 * - 'Date of birth' will be read as 'Date of birth, January 2021' if the current month is January 2021.
	 * - 'Appointment date' will be read as 'Appointment date, January 2021' if the current month is January 2021.
	 * - 'Booking date' will be read as 'Booking date, January 2021' if the current month is January 2021.
	 */
	calendarLabel?: ReadableProp<string>;

	/**
	 * The default locale setting.
	 *
	 * @default 'en'
	 */
	locale?: ReadableProp<string>;

	/**
	 * The default locale setting.
	 *
	 * @default 'en'
	 */
	multiple?: ReadableProp<boolean>;

	/**
	 * Whether the calendar is disabled. When true, the user will not
	 * be able to focus or select dates. @see readonly for a similar prop
	 * that allows focusing but not selecting dates.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * Whether the calendar is readonly. When true, the user will be able
	 * to focus and navigate the calendar, but will not be able to select
	 * dates. @see disabled for a similar prop that prevents focusing
	 * and selecting dates.
	 *
	 * @default false
	 */
	readonly?: ReadableProp<boolean>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<CalendarIdParts>>;
};

export type Calendar = ReturnType<typeof createCalendar>;
