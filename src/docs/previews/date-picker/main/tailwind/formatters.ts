export const dateFormatter = new Intl.DateTimeFormat(undefined, {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});

export const monthYearFormatter = new Intl.DateTimeFormat(undefined, {
	year: 'numeric',
	month: 'long',
});
