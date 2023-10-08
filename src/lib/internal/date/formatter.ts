import {
	DateFormatter,
	ZonedDateTime,
	type DateValue,
	getLocalTimeZone,
} from '@internationalized/date';

export type Formatter = ReturnType<typeof createFormatter>;

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

	function fullMonthAndYear(date: Date) {
		return new DateFormatter(locale, { month: 'long', year: 'numeric' }).format(date);
	}

	function fullMonth(date: Date) {
		return new DateFormatter(locale, { month: 'long' }).format(date);
	}

	function fullYear(date: Date) {
		return new DateFormatter(locale, { year: 'numeric' }).format(date);
	}

	function toParts(date: Date, options?: Intl.DateTimeFormatOptions) {
		return new DateFormatter(locale, options).formatToParts(date);
	}

	function dayPeriod(date: Date): 'AM' | 'PM' {
		const parts = new DateFormatter(locale, {
			hour12: true,
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
		let date: Date;

		if (dateObj instanceof ZonedDateTime) {
			date = dateObj.toDate();
		} else {
			date = dateObj.toDate(getLocalTimeZone());
		}

		const parts = toParts(date, opts);
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
	};
}
