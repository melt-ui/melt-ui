/**
 * @module dateTypes
 */

import type { DateValue } from '@internationalized/date';
import type { getAnnouncer } from './announcer.js';

export type Granularity = 'day' | 'hour' | 'minute' | 'second';

// Days of the week, starting with Sunday
const daysOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = {
	daysOfWeek: (typeof daysOfWeek)[number][];
};

export type Matcher = (date: DateValue) => boolean;
export type Announcer = ReturnType<typeof getAnnouncer>;
export type DateRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};

export type Month<T> = {
	/**
	 * A `DateValue` used to represent the month. Since days
	 * from the previous and next months may be included in the
	 * calendar grid, we need a source of truth for the value
	 * the grid is representing.
	 */
	value: DateValue;

	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	weeks: T[][];

	/**
	 * An array of all the dates in the current month, including dates from
	 * the previous and next months that are used to fill out the calendar grid.
	 * This array is useful for rendering the calendar grid in a customizable way,
	 * as it provides all the dates that should be displayed in the grid in a flat
	 * array.
	 */
	dates: T[];
};
