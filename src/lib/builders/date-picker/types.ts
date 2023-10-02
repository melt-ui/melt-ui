import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { createDatePicker } from './create.js';
import type { CreatePopoverProps, Matcher } from '$lib/builders/index.js';

export type DatePickerProps = {
	/**
	 * When in `single` mode, allow deselecting the selected date when the
	 * date is clicked again.
	 */
	allowDeselect?: boolean;

	/**
	 * The default value for the date picker.
	 */
	defaultValue?: Date;

	/**
	 * Change function called when the value of the date picker changes.
	 */
	onValueChange?: ChangeFn<Date | undefined>;

	/**
	 * An option writable store that can be used to control the value of the
	 * date picker from outside the builder.
	 */
	value?: Writable<Date | undefined>;

	/**
	 * The date that is used to display the initial month and
	 * which date will be focused when the date picker is opened.
	 *
	 * @default new Date()
	 */
	activeDate?: Date;

	/**
	 * Whether or not to use paged navigation for the next and previous
	 * buttons in the date picker. Paged navigation will change all months
	 * in the view when the next/prev buttons are clicked. Non-paged navigation
	 * just shifts by a single month.
	 *
	 * @default false
	 */
	pagedNavigation?: boolean;

	/**
	 * Which day of the week to start the calendar on.
	 * 0 = Sunday, 1 = Monday, etc.
	 *
	 * @default 0 (Sunday)
	 */
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

	ISOWeek?: boolean;

	/**
	 * Any dates that match the provided matchers will
	 * be disabled.
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
	 * The number of months to display at once.
	 *
	 * @default 1
	 */
	numberOfMonths?: number;

	/**
	 * The format to use for displaying the time in the input.
	 *
	 * @default 24
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
};

export type CreateDatePickerProps = DatePickerProps & CreatePopoverProps;

export type DatePicker = ReturnType<typeof createDatePicker>;
