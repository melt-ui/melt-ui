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
