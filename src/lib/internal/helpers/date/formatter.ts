import { DateFormatter, type DateValue } from '@internationalized/date';
import { hasTime, isZonedDateTime, toDate } from '.';

export type Formatter = ReturnType<typeof createFormatter>;

/**
 * Creates a wrapper around the `DateFormatter`, which is
 * an improved version of the {@link Intl.DateTimeFormat} API,
 * that is used internally by the various date builders to
 * easily format dates in a consistent way.
 *
 * @see [DateFormatter](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html)
 */
export function createFormatter(initialLocale: string) {
	let locale = initialLocale;

	function setLocale(newLocale: string) {
		locale = newLocale;
	}

	function getLocale() {
		return locale;
	}

	function custom(date: Date, options: Intl.DateTimeFormatOptions) {
		return new DateFormatter(locale, options).format(date);
	}

	function selectedDate(date: DateValue, includeTime = true) {
		if (hasTime(date) && includeTime) {
			return custom(toDate(date), {
				dateStyle: 'long',
				timeStyle: 'long',
			});
		} else {
			return custom(toDate(date), {
				dateStyle: 'long',
			});
		}
	}

	function fullMonthAndYear(date: Date) {
		return new DateFormatter(locale, { month: 'long', year: 'numeric' }).format(date);
	}

	function fullMonth(date: Date) {
		return new DateFormatter(locale, { month: 'long' }).format(date);
	}

	function fullYear(date: Date) {
		return new DateFormatter(locale, { year: 'numeric' }).format(date);
	}

	function toParts(date: DateValue, options?: Intl.DateTimeFormatOptions) {
		if (isZonedDateTime(date)) {
			console.log(date.timeZone);
			return new DateFormatter(locale, {
				...options,
				timeZone: date.timeZone,
			}).formatToParts(toDate(date));
		} else {
			return new DateFormatter(locale, options).formatToParts(toDate(date));
		}
	}

	function dayOfWeek(date: Date, length: Intl.DateTimeFormatOptions['weekday'] = 'narrow') {
		return new DateFormatter(locale, { weekday: length }).format(date);
	}

	function dayPeriod(date: Date) {
		const parts = new DateFormatter(locale, {
			hour: 'numeric',
			minute: 'numeric',
		}).formatToParts(date);
		const value = parts.find((p) => p.type === 'dayPeriod')?.value;
		if (value === 'PM') {
			return 'PM';
		}
		return 'AM';
	}

	const defaultPartOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	};

	function part(
		dateObj: DateValue,
		type: Intl.DateTimeFormatPartTypes,
		options: Intl.DateTimeFormatOptions = {}
	) {
		const opts = { ...defaultPartOptions, ...options };
		const parts = toParts(dateObj, opts);
		const part = parts.find((p) => p.type === type);
		return part ? part.value : '';
	}

	return {
		setLocale,
		getLocale,
		fullMonth,
		fullYear,
		fullMonthAndYear,
		toParts,
		custom,
		part,
		dayPeriod,
		selectedDate,
		dayOfWeek,
	};
}
