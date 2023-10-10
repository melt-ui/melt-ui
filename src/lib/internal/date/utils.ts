import type { Granularity } from './types.js';
import {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
	type DateValue,
	parseZonedDateTime,
	parseDateTime,
	parseDate,
	getLocalTimeZone,
} from '@internationalized/date';

/**
 * Generate a default `DateValue` using granularity.
 */
export function getDefaultDate(granularity: Granularity = 'day'): DateValue {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const calendarDateTimeGranularities = ['hour', 'minute', 'second'];

	if (calendarDateTimeGranularities.includes(granularity)) {
		return new CalendarDateTime(year, month, day, 0, 0, 0);
	}

	return new CalendarDate(year, month, day);
}

/**
 * Given a date string and a reference `DateValue` object, parse the
 * string to the same type as the reference object.
 *
 * Useful for parsing strings from data attributes, which are always
 * strings, to the same type as the value of the date field.
 */
export function parseStringToDateValue(dateStr: string, referenceVal: DateValue): DateValue {
	if (referenceVal instanceof ZonedDateTime) {
		return parseZonedDateTime(dateStr);
	} else if (referenceVal instanceof CalendarDateTime) {
		return parseDateTime(dateStr);
	} else {
		return parseDate(dateStr);
	}
}

/**
 * Given a `DateValue` object, convert it to a native `Date` object.
 * If a timezone is provided, the date will be converted to that timezone.
 * If no timezone is provided, the date will be converted to the local timezone.
 */
export function toDate(dateValue: DateValue, tz: string = getLocalTimeZone()) {
	if (dateValue instanceof ZonedDateTime) {
		return dateValue.toDate();
	} else {
		return dateValue.toDate(tz);
	}
}

export function isCalendarDateTime(dateValue: DateValue): dateValue is CalendarDateTime {
	return dateValue instanceof CalendarDateTime;
}

export function isZonedDateTime(dateValue: DateValue): dateValue is ZonedDateTime {
	return dateValue instanceof ZonedDateTime;
}

export function hasTime(dateValue: DateValue) {
	return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}

export function getDaysInMonth(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return new Date(year, month, 0).getDate();
}

/**
 * Determine if a date is before the reference date.
 * @param dateToCompare - the date to compare
 * @param referenceDate - the reference date to make the comparison against
 */
export function isBefore(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) < 0;
}

/**
 * Determine if a date is after the reference date.
 * @param dateToCompare - the date to compare
 * @param referenceDate - the reference date to make the comparison against
 */
export function isAfter(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) > 0;
}

/**
 * Determine if a date is before or the same as the reference date.
 *
 * @param dateToCompare - the date to compare
 * @param referenceDate - the reference date to make the comparison against
 */
export function isBeforeOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) <= 0;
}

/**
 * Determine if a date is after or the same as the reference date.
 *
 * @param dateToCompare - the date to compare
 * @param referenceDate - the reference date to make the comparison against
 */
export function isAfterOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) >= 0;
}

/**
 * Determine if a date is inclusively between a start and end reference date.
 *
 * @param date - the date to compare
 * @param start - the start reference date to make the comparison against
 * @param end - the end reference date to make the comparison against
 */
export function isBetweenInclusive(date: DateValue, start: DateValue, end: DateValue) {
	return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}

/**
 * Determine if a date is between a start and end reference date.
 *
 * @param date - the date to compare
 * @param start - the start reference date to make the comparison against
 * @param end - the end reference date to make the comparison against
 */
export function isBetween(date: DateValue, start: DateValue, end: DateValue) {
	return isAfter(date, start) && isBefore(date, end);
}

export function isDateValue(value: unknown): value is DateValue {
	return (
		value instanceof CalendarDate ||
		value instanceof CalendarDateTime ||
		value instanceof ZonedDateTime
	);
}

export function isDateValueArray(value: unknown): value is DateValue[] {
	return Array.isArray(value) && value.every((v) => isDateValue(v));
}

export function defaultMatcher(_: DateValue) {
	return false;
}
