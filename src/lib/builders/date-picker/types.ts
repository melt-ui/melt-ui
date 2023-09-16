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
	defaultValue?: Date[];

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
	 * The date that is used to display the initial month and
	 * which date will be focused when the date picker is opened.
	 *
	 * @default new Date()
	 */
	activeDate: Date;

	/**
	 * Whether or not to use paged navigation for the next and previous
	 * buttons in the date picker. Paged navigation will change all months
	 * in the view when the next/prev buttons are clicked. Non-paged navigation
	 * just shifts by a single month.
	 *
	 * @default false
	 */
	pagedNavigation?: boolean;

	ISOWeek?: boolean;

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

	/**
	 * The number of months to display at once.
	 *
	 * @default 1
	 */
	numberOfMonths: number;
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

export type Month = {
	month: Date;
	dates: Date[];
	nextMonthDates: Date[];
	lastMonthDates: Date[];
};
