import type { CreateDatePickerProps, DateRange, Matcher } from './types';
import dayjs from 'dayjs';

export function isBefore(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isBefore(date2);
}

export function isAfter(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isAfter(date2);
}

export function isBetween(date: Date, start: Date, end: Date) {
	return isAfter(date, start) && isBefore(date, end);
}

export function isSameDay(date1: Date, date2: Date) {
	const d1 = dayjs(date1);
	return d1.isSame(date2, 'day');
}

export function isToday(date: Date) {
	return isSameDay(date, new Date());
}

export function nextMonth(date: Date): Date {
	const d = new Date(date);
	d.setMonth(d.getMonth() + 1);
	return d;
}

export function prevMonth(date: Date): Date {
	const d = new Date(date);
	d.setMonth(d.getMonth() - 1);
	return d;
}

export function nextYear(date: Date): Date {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() + 1);
	return d;
}

export function prevYear(date: Date): Date {
	const d = new Date(date);
	d.setFullYear(d.getFullYear() - 1);
	return d;
}

export function getLastSunday(date: Date): Date {
	const d = new Date(date);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

export function getNextSaturday(date: Date): Date {
	const d = new Date(date);
	d.setDate(d.getDate() + (6 - d.getDay()));
	return d;
}

export function addDays(date: Date, days: number): Date {
	const d = dayjs(date);
	d.add(days, 'day');
	return d.toDate();
}

export function getDaysBetween(start: Date, end: Date) {
	const days: Date[] = [];
	let dCurrent = dayjs(start).add(1);
	const dEnd = dayjs(end);
	while (dCurrent.isBefore(dEnd)) {
		days.push(dCurrent.toDate());
		dCurrent = dCurrent.add(1, 'day');
	}
	return days;
}

export function addMonths(date: Date, months: number): Date {
	const d = dayjs(date);
	d.add(months, 'month');
	return d.toDate();
}

export function subMonths(date: Date, months: number): Date {
	const d = dayjs(date);
	d.subtract(months, 'month');
	return d.toDate();
}

export function addYears(date: Date, years: number): Date {
	const d = dayjs(date);
	d.add(years, 'year');
	return d.toDate();
}

export function subYears(date: Date, years: number): Date {
	const d = dayjs(date);
	d.subtract(years, 'year');
	return d.toDate();
}

type IsSelectedArgs = {
	date: Date;
	value: Date[];
	mode: CreateDatePickerProps['mode'];
};

export function isSelected(props: IsSelectedArgs) {
	const { mode, value, date } = props;

	if (mode === 'single') {
		if (value.length) {
			return isSameDay(value[0], date);
		}
		return false;
	} else if (mode === 'range') {
		if (isSameDay(value[0], date)) {
			return true;
		} else if (value.length > 1 && isSameDay(value[1], date)) {
			return true;
		} else if (value.length > 1 && isBetween(date, value[0], value[1])) {
			return true;
		}
		return false;
	} else if (mode === 'multiple') {
		return value.some((d) => isSameDay(d, date));
	}
	return false;
}

// function isDisabled(date: Date, matcher: Matcher | Matcher[]) {
// 	if (Array.isArray(matcher)) {
// 		// handle multiple matchers
// 	}
// }

// function matchDateRange(matcher: DateRange, date: Date) {
// 	if (matcher.to && !matcher.from) {
// 		return isBefore(date, matcher.to);
// 	}

// 	if (matcher.to && matcher.from) {
// 		return isBetween(date, matcher.from, matcher.to);
// 	}
// }
