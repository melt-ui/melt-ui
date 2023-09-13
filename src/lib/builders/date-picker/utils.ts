import type { CreateDatePickerProps } from './types';

export function isBefore(date1: Date, date2: Date) {
	const d1 = date1.setHours(0, 0, 0, 0);
	const d2 = date2.setHours(0, 0, 0, 0);
	return d1 < d2;
}

export function isAfter(date1: Date, date2: Date) {
	const d1 = date1.setHours(0, 0, 0, 0);
	const d2 = date2.setHours(0, 0, 0, 0);
	return d1 > d2;
}

export function isBetween(date: Date, start: Date, end: Date) {
	return isAfter(date, start) && isBefore(date, end);
}

export function isSameDay(date1: Date, date2: Date) {
	const d1 = date1.setHours(0, 0, 0, 0);
	const d2 = date2.setHours(0, 0, 0, 0);
	return d1 === d2;
}

export function isToday(date: Date) {
	return isSameDay(date, new Date());
}

export function nextMonth(date: Date) {
	const d = new Date(date);
	d.setMonth(d.getMonth() + 1);
	return d;
}

export function prevMonth(date: Date) {
	const d = new Date(date);
	d.setMonth(d.getMonth() - 1);
	return d;
}

export function nextYear(date: Date) {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() + 1);
	return d;
}

export function prevYear(date: Date) {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() - 1);
	return d;
}

export function getLastSunday(date: Date) {
	const d = new Date(date);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

export function getNextSaturday(date: Date) {
	const d = new Date(date);
	d.setDate(d.getDate() + (6 - d.getDay()));
	return d;
}

export function addDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

export function getDaysBetween(start: Date, end: Date) {
	const days = [];
	let current = new Date(start);
	while (current < end) {
		days.push(new Date(current));
		current = addDays(current, 1);
	}
	return days;
}

export function addMonths(date: Date, months: number) {
	const d = new Date(date);
	d.setMonth(d.getMonth() + months);
	return d;
}

export function subMonths(date: Date, months: number) {
	const d = new Date(date);
	d.setMonth(d.getMonth() - months);
	return d;
}

export function addYears(date: Date, years: number) {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() + years);
	return d;
}

export function subYears(date: Date, years: number) {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() - years);
	return d;
}

interface GetSelectedFromValuesArgs {
	date: Date;
	value: Date[];
	mode: CreateDatePickerProps['mode'];
}

export const getSelectedFromValue: (props: GetSelectedFromValuesArgs) => boolean = ({
	date,
	mode,
	value,
}) => {
	switch (mode) {
		case 'single':
			if (value.length) {
				return isSameDay(value[0], date);
			}
			return false;
		case 'range':
			if (isSameDay(value[0], date)) {
				return true;
			} else if (value.length > 1 && isSameDay(value[1], date)) {
				return true;
			} else if (value.length > 1 && isBetween(date, value[0], value[1])) {
				return true;
			}

			return false;
		case 'multiple':
			return value.some((d) => isSameDay(d, date));
		default:
			return false;
	}
};
