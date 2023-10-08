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
export function getDefaultDate(granularity: Granularity): DateValue {
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

export function isZonedDateTime(dateValue: DateValue): dateValue is ZonedDateTime {
	return dateValue instanceof ZonedDateTime;
}

export function hasTime(dateValue: DateValue) {
	return dateValue instanceof CalendarDateTime || dateValue instanceof ZonedDateTime;
}

export function getDaysInMonth(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return new Date(year, month, 0).getDate();
}
