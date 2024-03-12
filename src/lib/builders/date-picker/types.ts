import type { CreateCalendarProps, CreatePopoverProps } from '$lib/builders/index.js';
import type { Matcher } from '$lib/index.js';
import type { ReadableProp } from '$lib/internal/helpers/index.js';
import type { RenameProperties } from '$lib/internal/types.js';
import type { DateValue } from '@internationalized/date';
import type { CreateDateFieldProps } from '../date-field/types.js';
import type { createDatePicker } from './create.js';

export type DatePickerProps = {
	/**
	 * The value for the date picker. When provided,
	 * the `activeDate` will assume this value so the calendar
	 * will open to the month/year of this value.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<DateValue>;

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
	 * @default CalendarDate - the current date at midnight.
	 */
	placeholder?: ReadableProp<DateValue>;

	/**
	 * Any dates that match the provided matchers will
	 * be marked as disabled, which means they cannot be
	 * focused or selected. They will also include a data
	 * attribute that can be used to style them differently
	 * than the other dates.
	 *
	 * @default undefined
	 */
	isDateDisabled?: ReadableProp<Matcher>;

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
	 * @default undefined
	 */
	isDateUnavailable?: ReadableProp<Matcher>;

	/**
	 * @default 'en'
	 */
	locale?: string;
};

type ModifiedDateFieldProps = Omit<
	RenameProperties<CreateDateFieldProps, { ids: 'dateFieldIds' }>,
	'readonlySegments'
>;

type ModifiedCalendarProps = RenameProperties<CreateCalendarProps, { ids: 'calendarIds' }>;
type ModifiedPopoverProps = Omit<
	RenameProperties<CreatePopoverProps, { ids: 'popoverIds' }>,
	'disabled'
>;

export type CreateDatePickerProps = Expand<
	DatePickerProps & ModifiedDateFieldProps & ModifiedPopoverProps & ModifiedCalendarProps
>;

export type DatePicker = ReturnType<typeof createDatePicker>;
