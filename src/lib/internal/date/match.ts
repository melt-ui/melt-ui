import {
	isBefore,
	type DateAfter,
	type DateBefore,
	type DateRange,
	type DayOfWeek,
	type Matcher,
	isAfter,
	isAfterOrSame,
	isBeforeOrSame,
	isBetweenInclusive,
	isDateValue,
	toDate,
	isDateValueArray,
} from '.';
import { isSameDay, type DateValue } from '@internationalized/date';

/** Returns true if `value` is an array of valid dates. */

export function isMatch(date: DateValue, matcher: Matcher | Matcher[]): boolean {
	if (Array.isArray(matcher)) {
		if (isDateValueArray(matcher)) {
			return matchDateArray(matcher, date);
		}
		return matcher.some((m) => checkIsMatch(date, m));
	}
	return checkIsMatch(date, matcher);
}

function checkIsMatch(date: DateValue, matcher: Matcher): boolean {
	if (isDateValueArray(matcher)) {
		return matchDateArray(matcher, date);
	}

	if (isFunctionMatcher(matcher)) {
		return matcher(date);
	}

	if (typeof matcher === 'boolean') {
		return matcher;
	}

	if (isDateValue(matcher)) {
		return matchDate(matcher, date);
	}

	if (isDateRangeMatcher(matcher)) {
		return matchDateRange(matcher, date);
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

function isDateBeforeMatcher(matcher: Matcher): matcher is DateBefore {
	return typeof matcher === 'object' && 'before' in matcher;
}

function isDateAfterMatcher(matcher: Matcher): matcher is DateAfter {
	return typeof matcher === 'object' && 'after' in matcher;
}

function isFunctionMatcher(matcher: Matcher): matcher is (date: DateValue) => boolean {
	return typeof matcher === 'function';
}

function isDayOfWeekMatcher(matcher: Matcher): matcher is DayOfWeek {
	return typeof matcher === 'object' && 'daysOfWeek' in matcher;
}

/**
 * Match a date against an inclusive date range matcher.
 */
function matchDateRange(matcher: DateRange, date: DateValue): boolean {
	if (!(matcher.start && matcher.end)) {
		// if both are not defined we can't match
		return false;
	}

	if (matcher.start && !matcher.end) {
		// if only to is defined, match if date is before or same as to
		return isBeforeOrSame(date, matcher.end);
	}

	if (matcher.end && matcher.start) {
		// if both are defined, match if date is between or same as to and from
		return isBetweenInclusive(date, matcher.start, matcher.end);
	}

	if (matcher.start) {
		// if only from is defined, match if date is after or same as from
		return isAfterOrSame(date, matcher.start);
	}
	return false;
}

function matchDateBefore(matcher: DateBefore, date: DateValue): boolean {
	return isBefore(date, matcher.before);
}

function matchDateAfter(matcher: DateAfter, date: DateValue): boolean {
	return isAfter(date, matcher.after);
}

function matchDateArray(matcher: DateValue[], date: DateValue): boolean {
	return matcher.some((d) => isSameDay(d, date));
}

function matchDate(matcher: DateValue, date: DateValue): boolean {
	return isSameDay(matcher, date);
}

function matchDayOfWeek(matcher: DayOfWeek, date: DateValue): boolean {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return matcher.daysOfWeek.includes(toDate(date).getDay() as any);
}

export function isSingleDateValue(
	value: DateValue | DateValue[] | DateRange | undefined
): value is DateValue {
	return isDateValue(value);
}

export function isDateRange(
	value: DateValue | DateValue[] | DateRange | undefined
): value is DateRange {
	if (value === undefined) return false;
	return 'start' in value;
}
