import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { createDatePicker } from './create';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

export type BaseDatePickerProps = {
	earliest: Date | null;
	latest: Date | null;
	autoSelect: boolean;
	/**
	 * When in `single` mode, allow deselecting the selected date when the
	 * date is clicked again.
	 */
	allowDeselect: boolean;
	defaultValue: Date[];
	onValueChange: ChangeFn<Date[]>;
	value: Writable<Date[]>;
	mode: 'single' | 'range' | 'multiple';
	activeDate: Date;
	ISOWeek: boolean;
	defaultMonth: Date;
	disabled: Matcher | Matcher[];
	/**
	 * Display 6 weeks per month, regardless the month's number of weeks.
	 * To use this, ensure `showOutsideDays` is `true`.
	 */
	fixedWeeks: boolean;
};

type DateRange = {
	from: Date | undefined;
	to?: Date;
};

type DateBefore = {
	before: Date;
};

type DateAfter = {
	after: Date;
};

type DateInterval = {
	after: Date;
	before: Date;
};

// Days of the week, starting with Sunday
const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
type DayOfWeek = {
	dayOfWeek: (typeof daysOfWeek)[number][];
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
	disabled?: boolean;
};

export type CreateDatePickerReturn = ReturnType<typeof createDatePicker>;
