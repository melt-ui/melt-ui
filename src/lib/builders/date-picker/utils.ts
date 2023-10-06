export function getDaysInMonth(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return new Date(year, month, 0).getDate();
}
