import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { createDateRangePicker } from './create.js';
import type { CreatePopoverProps } from '$lib/builders/index.js';
import type { DateValue } from '@internationalized/date';
import type { DateRange, Matcher } from '$lib/index.js';
import type { RenameProperties } from '$lib/internal/types.js';
import type { CreateDateRangeFieldProps } from '../date-range-field/types.js';
import type { CreateRangeCalendarProps } from '../range-calendar/types.js';

type DateRangePickerProps = {
	/**
	 * The default value for the date field. When provided,
	 * the `placeholder` will also assume this value.
	 *
	 * @default undefined;
	 */
	defaultValue?: DateRange;

	/**
	 * A function called when the value of the date field changes.
	 * It receives a single argument, which is an object containing
	 * `curr` and `prev` properties, whose values are the current
	 * and previous values of the value store. Whatever you return
	 * from this function will be set as the new value of the value
	 * store.
	 *
	 * @default undefined
	 */
	onValueChange?: ChangeFn<DateRange>;

	/**
	 * A writable store than can be used to control the value of the
	 * date picker from outside the builder. This is useful if you
	 * want to sync the value of the date field with another store
	 * used in your app.
	 *
	 * @default undefined;
	 */
	value?: Writable<DateRange>;

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
	defaultPlaceholder?: DateValue;

	/**
	 * A writable store that can be used to control the placeholder
	 * date from outside the builder. When this prop is provided,
	 * the `defaultPlaceholder` prop is ignored, and the value
	 * of this store is used instead.
	 *
	 * The `placeholder` store is not used to set the value of the
	 * date picker, it is only used to control the starting point for
	 * the calendar. The `placeholder` store is used to determine
	 * where the calendar should start when it is first opened without
	 * a value, as well as the starting point for cycling through the
	 * individual date segments.
	 *
	 * When the date picker is first opened, if the `value` of the
	 * date picker is set, the `placeholder` will be set
	 * to the same value as the `value` store. If the `value` store is
	 * not set, the `placeholder` will initially be set to the same
	 * value as the `defaultPlaceholder` prop.
	 *
	 * @default Writable<CalendarDate> - the current date at midnight.
	 */
	placeholder?: Writable<DateValue>;

	/**
	 * A function called when the placeholder value changes. It receives
	 * a single argument, which is an object containing `curr` and
	 * `prev` properties, whose values are the current and previous
	 * values of the `placeholder` store. Whatever you return from this
	 * function will be set as the new value of the `placeholder` store.
	 *
	 * The `placeholder` is kept in sync with the `value` store, so
	 * ensure you know what you're doing if you intend on overriding the
	 * value, as it may render the date picker unusable.
	 *
	 * @default undefined
	 */
	onPlaceholderChange?: ChangeFn<DateValue>;

	/**
	 * Any dates that match the provided matchers will
	 * be marked as disabled, which means they cannot be
	 * focused or selected. They will also include a data
	 * attribute that can be used to style them differently
	 * than the other dates.
	 *
	 * @default undefined;
	 */
	isDateDisabled?: Matcher;

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
	isDateUnavailable?: Matcher;

	/**
	 * @default 'en'
	 */
	locale?: string;
};

type ModifiedDateFieldProps = Omit<
	RenameProperties<CreateDateRangeFieldProps, { ids: 'dateFieldIds' }>,
	'readonlySegments'
>;
type ModifiedCalendarProps = RenameProperties<CreateRangeCalendarProps, { ids: 'calendarIds' }>;
type ModifiedPopoverProps = Omit<
	RenameProperties<CreatePopoverProps, { ids: 'popoverIds' }>,
	'disabled'
>;

export type CreateDateRangePickerProps = Expand<
	DateRangePickerProps & ModifiedDateFieldProps & ModifiedPopoverProps & ModifiedCalendarProps
>;

export type DateRangePicker = ReturnType<typeof createDateRangePicker>;
