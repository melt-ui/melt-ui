import { DateFormatter } from '@internationalized/date';

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

	function toParts(date: Date, options: Intl.DateTimeFormatOptions) {
		return new DateFormatter(locale, options).formatToParts(date);
	}

	function part(
		date: Date,
		options: Intl.DateTimeFormatOptions,
		type: Intl.DateTimeFormatPartTypes
	) {
		const parts = toParts(date, options);
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
	};
}
