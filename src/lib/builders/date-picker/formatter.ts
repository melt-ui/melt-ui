export function createFormatter(initialLocale: string) {
	let locale = initialLocale;

	function setLocale(newLocale: string) {
		locale = newLocale;
	}

	function getLocale() {
		return locale;
	}

	function custom(date: Date, options: Intl.DateTimeFormatOptions) {
		return new Intl.DateTimeFormat(locale, options).format(date);
	}

	function fullMonthAndYear(date: Date) {
		return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
	}

	function fullMonth(date: Date) {
		return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
	}

	function fullYear(date: Date) {
		return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
	}

	return {
		setLocale,
		getLocale,
		fullMonth,
		fullYear,
		fullMonthAndYear,
		custom,
	};
}
