import type { DateAfter, DateBefore, DateInterval, DateRange, DayOfWeek, Matcher } from './types';
import dayjs from 'dayjs';

export function isBefore(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isBefore(date2);
}

export function isBeforeOrSame(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isBefore(date2) || d1.isSame(date2);
}

export function isAfterOrSame(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isAfter(date2) || d1.isSame(date2);
}

export function isAfter(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isAfter(date2);
}

export function isBetween(date: Date, start: Date, end: Date) {
	return isAfter(date, start) && isBefore(date, end);
}

export function isBetweenInclusive(date: Date, start: Date, end: Date) {
	return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}

export function isSameDay(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isSame(date2, 'day');
}

export function isToday(date: Date) {
	return isSameDay(date, new Date());
}

export function getLastFirstDayOfWeek(date: Date, firstDayOfWeek: number): Date {
	const d = dayjs(date);
	const day = d.day();
	if (firstDayOfWeek > day) {
		return d.subtract(day + 7 - firstDayOfWeek, 'day').toDate();
	}
	if (firstDayOfWeek === day) {
		return d.toDate();
	}
	return d.subtract(day - firstDayOfWeek, 'day').toDate();
}

export function getNextLastDayOfWeek(date: Date, firstDayOfWeek: number): Date {
	const d = dayjs(date);
	const day = d.day();
	const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

	if (day === lastDayOfWeek) {
		return d.toDate();
	}

	if (day > lastDayOfWeek) {
		return d.add(7 - day + lastDayOfWeek, 'day').toDate();
	}

	return d.add(lastDayOfWeek - day, 'day').toDate();
}

export function getLastSunday(date: Date): Date {
	const d = new Date(date);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

export function getNextSunday(date: Date): Date {
	const d = new Date(date);
	d.setDate(d.getDate() + (7 - d.getDay()));
	return d;
}

export function getNextSaturday(date: Date): Date {
	const d = dayjs(date);
	const day = d.day();
	if (day === 6) {
		return d.toDate();
	}
	return d.add(6 - day, 'day').toDate();
}

export function addDays(date: Date, days: number): Date {
	const d = dayjs(date);
	d.add(days, 'day');
	return d.toDate();
}

export function getDaysBetween(start: Date, end: Date) {
	const days: Date[] = [];
	let dCurrent = dayjs(start).add(1, 'day');
	const dEnd = dayjs(end);
	while (dCurrent.isBefore(dEnd)) {
		days.push(dCurrent.toDate());
		dCurrent = dCurrent.add(1, 'day');
	}
	return days;
}

/** Returns true if `value` is an array of valid dates. */
function isArrayOfDates(value: unknown): value is Date[] {
	return Array.isArray(value) && value.every((v) => v instanceof Date);
}

type IsSelectedArgs = {
	date: Date;
	value: Date[] | Date | DateRange | undefined;
};

export function isSelected(props: IsSelectedArgs) {
	const { value, date } = props;

	if (isSingleDate(value)) {
		return isSameDay(value, date);
	}

	if (isDateRange(value)) {
		if (value.from === undefined) return false;

		if (isSameDay(value.from, date)) return true;
		if (value.to !== undefined) {
			if (isSameDay(value.to, date)) return true;
			if (isBetween(date, value.from, value.to)) return true;
		}
		return false;
	}

	if (isDateArray(value)) {
		return value.some((d) => isSameDay(d, date));
	}
	return false;
}

export function isMatch(date: Date, matcher: Matcher | Matcher[]): boolean {
	if (Array.isArray(matcher)) {
		if (isArrayOfDates(matcher)) {
			return matchDateArray(matcher, date);
		}
		return matcher.some((m) => checkIsMatch(date, m));
	}
	return checkIsMatch(date, matcher);
}

function checkIsMatch(date: Date, matcher: Matcher): boolean {
	if (isArrayOfDates(matcher)) {
		return matchDateArray(matcher, date);
	}

	if (isFunctionMatcher(matcher)) {
		return matcher(date);
	}

	if (typeof matcher === 'boolean') {
		return matcher;
	}

	if (matcher instanceof Date) {
		return matchDate(matcher, date);
	}

	if (isDateRangeMatcher(matcher)) {
		return matchDateRange(matcher, date);
	}

	if (isDateIntervalMatcher(matcher)) {
		return matchDateInterval(matcher, date);
	}

	if (isDateBeforeMatcher(matcher)) {
		return matchDateBefore(matcher, date);
	}

	if (isDateAfterMatcher(matcher)) {
		return matchDateAfter(matcher, date);
	}

	if (isDayOfWeekMatcher(matcher)) {
		return matchDayOfWeek(matcher, date);
	}

	return false;
}

function isDateRangeMatcher(matcher: Matcher): matcher is DateRange {
	return typeof matcher === 'object' && 'from' in matcher;
}

function isDateIntervalMatcher(matcher: Matcher): matcher is DateInterval {
	return typeof matcher === 'object' && 'before' in matcher && 'after' in matcher;
}

function isDateBeforeMatcher(matcher: Matcher): matcher is DateBefore {
	return typeof matcher === 'object' && 'before' in matcher;
}

function isDateAfterMatcher(matcher: Matcher): matcher is DateAfter {
	return typeof matcher === 'object' && 'after' in matcher;
}

function isFunctionMatcher(matcher: Matcher): matcher is (date: Date) => boolean {
	return typeof matcher === 'function';
}

function isDayOfWeekMatcher(matcher: Matcher): matcher is DayOfWeek {
	return typeof matcher === 'object' && 'daysOfWeek' in matcher;
}

/**
 * Match a date against an inclusive date range matcher.
 */
function matchDateRange(matcher: DateRange, date: Date): boolean {
	if (!(matcher.to && matcher.from)) {
		// if both are not defined we can't match
		return false;
	}

	if (matcher.to && !matcher.from) {
		// if only to is defined, match if date is before or same as to
		return isBeforeOrSame(date, matcher.to);
	}

	if (matcher.to && matcher.from) {
		// if both are defined, match if date is between or same as to and from
		return isBetweenInclusive(date, matcher.from, matcher.to);
	}

	if (matcher.from) {
		// if only from is defined, match if date is after or same as from
		return isAfterOrSame(date, matcher.from);
	}
	return false;
}

function matchDateBefore(matcher: DateBefore, date: Date): boolean {
	return isBefore(date, matcher.before);
}

function matchDateAfter(matcher: DateAfter, date: Date): boolean {
	return isAfter(date, matcher.after);
}

function matchDateArray(matcher: Date[], date: Date): boolean {
	return matcher.some((d) => isSameDay(d, date));
}

function matchDate(matcher: Date, date: Date): boolean {
	return isSameDay(matcher, date);
}

function matchDateInterval(matcher: DateInterval, date: Date): boolean {
	return isBetween(date, matcher.before, matcher.after);
}

function matchDayOfWeek(matcher: DayOfWeek, date: Date): boolean {
	const d = dayjs(date);
	return matcher.daysOfWeek.includes(d.day() as DayOfWeek['daysOfWeek'][number]);
}

export function isSingleDate(value: Date | Date[] | DateRange | undefined): value is Date {
	return value instanceof Date;
}

export function isDateRange(value: Date | Date[] | DateRange | undefined): value is DateRange {
	if (value === undefined) return false;
	return 'from' in value && 'to' in value;
}

export function isDateArray(value: Date | Date[] | DateRange | undefined): value is Date[] {
	return Array.isArray(value);
}
