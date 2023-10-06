import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { createDatePicker } from './create.js';
import type { CreatePopoverProps, Matcher } from '$lib/builders/index.js';
import type { DateValue } from '@internationalized/date';

export type DatePickerProps<T extends DateValue> = {
	/**
	 * Allow deselecting the selected date, which would set the
	 * value to `undefined`. You can use this to ensure a date
	 * is always selected in certain situations.
	 *
	 * @default true
	 */
	allowDeselect?: boolean;

	/**
	 * The default value for the date picker. When provided,
	 * the `activeDate` will assume this value so the calendar
	 * will open to the month/year of this value.
	 *
	 * @default undefined;
	 */
	defaultValue?: T;

	/**
	 * A function called when the value of the date picker changes.
	 * It receives a single argument, which is an object containing
	 * `curr` and `prev` properties, whose values are the current
	 * and previous values of the value store. Whatever you return
	 * from this function will be set as the new value of the value
	 * store.
	 *
	 * @default undefined
	 */
	onValueChange?: ChangeFn<DateValue | undefined>;

	/**
	 * A writable store than can be used to control the value of the
	 * date picker from outside the builder. This is useful if you
	 * want to sync the value of the date picker with another store
	 * used in your app.
	 *
	 * @default undefined;
	 */
	value?: Writable<DateValue | undefined>;

	/**
	 * The date that is used to display the initial month and
	 * year of the calendar. When a `defaultValue` or `value`
	 * prop containing a date is provided, this prop is ignored.
	 *
	 * It is useful when you want to display a specific month
	 * and year when the calendar is first opened, but you don't
	 * necessarily want to set the value of the date picker to
	 * that date.
	 *
	 * @default Date() - the current date
	 */
	defaultFocusedValue?: DateValue;

	/**
	 * A writable store that can be used to control the focused
	 * date from outside the builder. When this prop is provided,
	 * the `defaultFocusedValue` prop is ignored, and the value
	 * of this store is used instead.
	 *
	 * The `focusedValue` store is not used to set the value of the
	 * date picker, it is only used to control the navigation of the
	 * calendar, which determines which month/year is displayed, and
	 * which date should be focused.
	 *
	 * When the date picker is first opened, if the `value` of the
	 * date picker is set, the `focusedValue` will initially be set
	 * to the same value as the `value` prop. If the `value` prop is
	 * not set, the `focusedValue` will initially be set to the same
	 * value as the `defaultFocusedValue` prop.
	 *
	 * @default writable(defaultFocusedValue)
	 */
	focusedValue?: Writable<DateValue>;

	/**
	 * A function called when the focused value changes. It receives
	 * a single argument, which is an object containing `curr` and
	 * `prev` properties, whose values are the current and previous
	 * values of the `focusedValue` store. Whatever you return from this
	 * function will be set as the new value of the `focusedValue` store.
	 *
	 * @default undefined
	 */
	onFocusedValueChange?: ChangeFn<DateValue>;

	/**
	 * Only applicable when `numberOfMonths` is greater than 1.
	 *
	 * Whether or not to use paged navigation for the next and previous
	 * buttons in the date picker. Paged navigation will change all months
	 * in the view when the next/prev buttons are clicked. Non-paged navigation
	 * just shifts by a single month.
	 *
	 * For example, with `pagedNavigation` set to `true`, if you have 2 months
	 * displayed, January and February, and you click the next button, the months
	 * in view will change to March and April. If `pagedNavigation` is `false`,
	 * the months in view will change to February and March.
	 *
	 * @default false
	 */
	pagedNavigation?: boolean;

	/**
	 * The day of the week to start the calendar on, which must
	 * be a number between 0 and 6, where 0 is Sunday and 6 is
	 * Saturday.
	 *
	 * @default 0 (Sunday)
	 */
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

	ISOWeek?: boolean;

	/**
	 * Any dates that match the provided matchers will
	 * be marked as disabled, which means they cannot be
	 * focused or selected. They will also include a data
	 * attribute that can be used to style them differently
	 * than the other dates.
	 *
	 * @default undefined;
	 */
	disabled?: Matcher | Matcher[];

	/**
	 * Any dates that match the provided matchers will be
	 * marked as unavailable, which is different from disabled,
	 * as unavailable dates can still be focused and selected,
	 * but will cause the date picker to be marked as invalid if
	 * selected.
	 *
	 * For example, if you are displaying a calendar for booking
	 * appointments, you may want to mark dates that are already
	 * bookes as unavailable, but may become available again before
	 * the appointment date, so the user can still select them to
	 * learn more about the appointment.
	 *
	 * @default undefined;
	 */
	unavailable?: Matcher | Matcher[];

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
	fixedWeeks?: boolean;

	/**
	 * The number of months to display on the calendar at once. To control
	 * how the months are navigated between, see the `pagedNavigation` prop.
	 *
	 * @default 1
	 */
	numberOfMonths?: number;

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the
	 * `dayPeriod` segment in your input to ensure the user
	 * can select AM/PM.
	 *
	 * @default 12
	 */
	hourCycle?: 12 | 24;

	/**
	 * The label for the calendar, which is used for
	 * accessibility purposes only and is not visible on the page,
	 * it is read by screen readers when the calendar is opened.
	 *
	 * We take the label you provide and append the current month and year
	 * to it, so you don't need to include that in the label.
	 *
	 * @example 'Date of birth' - will be read as 'Date of birth, January 2021' if the
	 * current month is January 2021.
	 * @example 'Appointment date' - will be read as 'Appointment date, January 2021' if the
	 * current month is January 2021.
	 * @example 'Booking date' - will be read as 'Booking date, January 2021' if the
	 * current month is January 2021.
	 */
	calendarLabel?: string;

	/**
	 * @default 'en'
	 */
	locale?: string;
};

export type CreateDatePickerProps<T extends DateValue = DateValue> = DatePickerProps<T> &
	CreatePopoverProps;

export type DatePicker = ReturnType<typeof createDatePicker>;
