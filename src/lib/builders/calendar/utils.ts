import { isHTMLElement } from '$lib/internal/helpers';
import { getDayOfWeek, type DateValue } from '@internationalized/date';

export function getDaysInMonth(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return new Date(year, month, 0).getDate();
}

export function getDaysBetween<T extends DateValue = DateValue>(start: T, end: T) {
	const days: T[] = [];
	let dCurrent = start.add({ days: 1 }) as T;
	const dEnd = end;
	while (dCurrent.compare(dEnd) < 0) {
		days.push(dCurrent);
		dCurrent = dCurrent.add({ days: 1 }) as T;
	}
	return days;
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

export function isCalendarCell(node: unknown): node is HTMLElement {
	if (!isHTMLElement(node)) return false;
	if (!node.hasAttribute('data-melt-calendar-cell')) return false;
	return true;
}
