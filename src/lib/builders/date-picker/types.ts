import type { createDatePicker } from './create';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

export type BaseDatePickerProps = {
	/**
	 * The earliest date that can be selected.
	 */
	earliest: Date | null;

	/**
	 * The latest date that can be selected.
	 */
	latest: Date | null;

	/**
	 * When in `single` mode, allow deselecting the selected date when the
	 * date is clicked again.
	 */
	allowDeselect: boolean;

	/**
	 * The default value for the date picker.
	 */
	defaultValue: Date[];

	/**
	 * Change function called when the value of the date picker changes.
	 */
	onValueChange: ChangeFn<Date[]>;

	/**
	 * An option writable store that can be used to control the value of the
	 * date picker from outside the builder.
	 */
	value: Writable<Date[]>;

	/**
	 * The mode of the date picker.
	 *
	 * - `single` - A single date can be selected.
	 * - `range` - A range of dates can be selected.
	 * - `multiple` - Multiple dates can be selected.
	 */
	mode: 'single' | 'range' | 'multiple';

	/**
	 * The date that is used to display the initial month
	 * in the datepicker.
	 *
	 * @default new Date()
	 */
	activeDate: Date;
	ISOWeek: boolean;
	defaultMonth: Date;
	/**
	 * Any dates that match the provided matchers will
	 * be disabled.
	 */
	disabled: Matcher | Matcher[];
	/**
	 * Any dates that match the provided matchers will
	 * be hidden.
	 */
	hidden: Matcher | Matcher[];
	/**
	 * Display 6 weeks per month, regardless the month's number of weeks.
	 * To use this, ensure `showOutsideDays` is `true`.
	 */
	fixedWeeks: boolean;
};

export type DateRange = {
	from: Date | undefined;
	to?: Date;
};

export type DateBefore = {
	before: Date;
};

export type DateAfter = {
	after: Date;
};

export type DateInterval = {
	after: Date;
	before: Date;
};

// Days of the week, starting with Sunday
const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = {
	daysOfWeek: (typeof daysOfWeek)[number][];
};

export type Matcher =
	| boolean
	| ((date: Date) => boolean)
	| Date
	| Date[]
	| DateRange
	| DateBefore
	| DateAfter
	| DateInterval
	| DayOfWeek;

export type CreateDatePickerProps = Partial<BaseDatePickerProps>;

export type DateProps = {
	value: Date;
	label: string;
};

export type CreateDatePickerReturn = ReturnType<typeof createDatePicker>;
