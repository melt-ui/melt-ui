import type { Granularity, Matcher } from './types.js';
import {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
	type DateValue,
	parseZonedDateTime,
	parseDateTime,
	parseDate,
	getLocalTimeZone,
	getDayOfWeek,
} from '@internationalized/date';

type GetDefaultDateProps = {
	defaultValue?: DateValue | DateValue[] | undefined;
	defaultPlaceholder?: DateValue | undefined;
	granularity?: Granularity;
};

const defaultDateDefaults = {
	defaultValue: undefined,
	defaultPlaceholder: undefined,
	granularity: 'day',
};

/**
 * A helper function used throughout the various date builders
 * to generate a default `DateValue` using the `defaultValue`,
 * `defaultPlaceholder`, and `granularity` props.
 *
 * It's important to match the `DateValue` type being used
 * elsewhere in the builder, so they behave according to the
 * behavior the user expects based on the props they've provided.
 *
 */
export function getDefaultDate(props?: GetDefaultDateProps): DateValue {
	const withDefaults = { ...defaultDateDefaults, ...props };
	const { defaultValue, defaultPlaceholder, granularity } = withDefaults;

	if (Array.isArray(defaultValue) && defaultValue.length) {
		return defaultValue[defaultValue.length - 1];
	}

	if (defaultValue && !Array.isArray(defaultValue)) {
		return defaultValue;
	} else if (defaultPlaceholder) {
		return defaultPlaceholder;
	} else {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const calendarDateTimeGranularities = ['hour', 'minute', 'second'];

		if (calendarDateTimeGranularities.includes(granularity ?? 'day')) {
			return new CalendarDateTime(year, month, day, 0, 0, 0);
		}

		return new CalendarDate(year, month, day);
	}
}

/**
 * Given a date string and a reference `DateValue` object, parse the
 * string to the same type as the reference object.
 *
 * Useful for parsing strings from data attributes, which are always
 * strings, to the same type being used by the date component.
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

/**
 * Given a date, return the number of days in the month.
 */
export function getDaysInMonth(date: Date | DateValue) {
	if (date instanceof Date) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		/**
		 * By using zero as the day, we get the
		 * last day of the previous month, which
		 * is the month we originally passed in.
		 */
		return new Date(year, month, 0).getDate();
	} else {
		return date.set({ day: 100 }).day;
	}
}

/**
 * Determine if a date is before the reference date.
 * @param dateToCompare - is this date before the `referenceDate`
 * @param referenceDate - is the `dateToCompare` before this date
 *
 * @see {@link isBeforeOrSame} for inclusive
 */
export function isBefore(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) < 0;
}

/**
 * Determine if a date is after the reference date.
 * @param dateToCompare - is this date after the `referenceDate`
 * @param referenceDate - is the `dateToCompare` after this date
 *
 * @see {@link isAfterOrSame} for inclusive
 */
export function isAfter(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) > 0;
}

/**
 * Determine if a date is before or the same as the reference date.
 *
 * @param dateToCompare - the date to compare
 * @param referenceDate - the reference date to make the comparison against
 *
 * @see {@link isBefore} for non-inclusive
 */
export function isBeforeOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) <= 0;
}

/**
 * Determine if a date is after or the same as the reference date.
 *
 * @param dateToCompare - is this date after or the same as the `referenceDate`
 * @param referenceDate - is the `dateToCompare` after or the same as this date
 *
 * @see {@link isAfter} for non-inclusive
 */
export function isAfterOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
	return dateToCompare.compare(referenceDate) >= 0;
}

/**
 * Determine if a date is inclusively between a start and end reference date.
 *
 * @param date - is this date inclusively between the `start` and `end` dates
 * @param start - the start reference date to make the comparison against
 * @param end - the end reference date to make the comparison against
 *
 * @see {@link isBetween} for non-inclusive
 */
export function isBetweenInclusive(date: DateValue, start: DateValue, end: DateValue) {
	return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}

/**
 * Determine if a date is between a start and end reference date.
 *
 * @param date - is this date between the `start` and `end` dates
 * @param start - the start reference date to make the comparison against
 * @param end - the end reference date to make the comparison against
 *
 * @see {@link isBetweenInclusive} for inclusive
 */
export function isBetween(date: DateValue, start: DateValue, end: DateValue) {
	return isAfter(date, start) && isBefore(date, end);
}

export function getLastFirstDayOfWeek<T extends DateValue = DateValue>(
	date: T,
	firstDayOfWeek: number,
	locale: string
): T {
	const day = getDayOfWeek(date, locale);

	if (firstDayOfWeek > day) {
		return date.subtract({ days: day + 7 - firstDayOfWeek }) as T;
	}
	if (firstDayOfWeek === day) {
		return date as T;
	}
	return date.subtract({ days: day - firstDayOfWeek }) as T;
}

export function getNextLastDayOfWeek<T extends DateValue = DateValue>(
	date: T,
	firstDayOfWeek: number,
	locale: string
): T {
	const day = getDayOfWeek(date, locale);
	const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

	if (day === lastDayOfWeek) {
		return date as T;
	}

	if (day > lastDayOfWeek) {
		return date.add({ days: 7 - day + lastDayOfWeek }) as T;
	}

	return date.add({ days: lastDayOfWeek - day }) as T;
}

export function areAllDaysBetweenValid(
	start: DateValue,
	end: DateValue,
	isUnavailable: Matcher | undefined,
	isDisabled: Matcher | undefined
) {
	if (isUnavailable === undefined && isDisabled === undefined) {
		return true;
	}
	let dCurrent = start.add({ days: 1 });
	if (isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) {
		return false;
	}
	const dEnd = end;
	while (dCurrent.compare(dEnd) < 0) {
		dCurrent = dCurrent.add({ days: 1 });
		if (isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) {
			return false;
		}
	}
	return true;
}
