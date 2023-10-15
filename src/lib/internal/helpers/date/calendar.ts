import { chunk, isHTMLElement } from '$lib/internal/helpers/index.js';
import { type DateValue, startOfMonth, endOfMonth } from '@internationalized/date';
import type { Month } from './types.js';
import {
	getDaysInMonth,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	parseStringToDateValue,
} from './index.js';
import { get, type Writable } from 'svelte/store';

/**
 * Checks if a given node is a calendar cell element.
 *
 * @param node - The node to check.
 */
export function isCalendarCell(node: unknown): node is HTMLElement {
	if (!isHTMLElement(node)) return false;
	if (!node.hasAttribute('data-melt-calendar-cell')) return false;
	return true;
}

/**
 * Retrieves an array of date values representing the days between
 * the provided start and end dates.
 */
export function getDaysBetween(start: DateValue, end: DateValue) {
	const days: DateValue[] = [];
	let dCurrent = start.add({ days: 1 });
	const dEnd = end;
	while (dCurrent.compare(dEnd) < 0) {
		days.push(dCurrent);
		dCurrent = dCurrent.add({ days: 1 });
	}
	return days;
}

export type CreateMonthProps = {
	/**
	 * The date object representing the month's date (usually the first day of the month).
	 */
	dateObj: DateValue;

	/**
	 * The day of the week to start the calendar on (0 for Sunday, 1 for Monday, etc.).
	 */
	weekStartsOn: number;

	/**
	 * Whether to always render 6 weeks in the calendar, even if the month doesn't
	 * span 6 weeks.
	 */
	fixedWeeks: boolean;

	/**
	 * The locale to use when creating the calendar month.
	 */
	locale: string;
};

/**
 * Creates a calendar month object.
 *
 * @remarks
 * Given a date, this function returns an object containing
 * the necessary values to render a calendar month, including
 * the month's date (the first day of that month), which can be
 * used to render the name of the month, an array of all dates
 * in that month, and an array of weeks. Each week is an array
 * of dates, useful for rendering an accessible calendar grid
 * using a loop and table elements.
 *
 */
function createMonth(props: CreateMonthProps): Month<DateValue> {
	const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
	const daysInMonth = getDaysInMonth(dateObj);

	const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));

	const firstDayOfMonth = startOfMonth(dateObj);
	const lastDayOfMonth = endOfMonth(dateObj);

	const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale);
	const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale);

	const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
	const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));

	const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

	if (fixedWeeks && totalDays < 42) {
		const extraDays = 42 - totalDays;

		let startFrom = nextMonthDays[nextMonthDays.length - 1];

		if (!startFrom) {
			startFrom = dateObj.set({ day: 1 }).subtract({ days: 1 });
		}

		const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
			const incr = i + 1;
			return startFrom.add({ days: incr });
		});
		nextMonthDays.push(...extraDaysArray);
	}

	const allDays = lastMonthDays.concat(datesArray, nextMonthDays);

	const weeks = chunk(allDays, 7);

	return {
		value: dateObj,
		dates: allDays,
		weeks,
	};
}

type SetMonthProps = CreateMonthProps & {
	numberOfMonths: number | undefined;
	currentMonths?: Month<DateValue>[];
};

export function createMonths(props: SetMonthProps) {
	const { numberOfMonths, dateObj, ...monthProps } = props;

	const months: Month<DateValue>[] = [];

	if (!numberOfMonths || numberOfMonths === 1) {
		months.push(
			createMonth({
				...monthProps,
				dateObj,
			})
		);
		return months;
	}

	months.push(
		createMonth({
			...monthProps,
			dateObj,
		})
	);

	// Create all the months, starting with the current month
	for (let i = 1; i < numberOfMonths; i++) {
		const nextMonth = dateObj.add({ months: i });
		months.push(
			createMonth({
				...monthProps,
				dateObj: nextMonth,
			})
		);
	}

	return months;
}

export function getSelectableCells(calendarId: string) {
	const node = document.getElementById(calendarId);
	if (!node) return [];
	const selectableSelector = `[data-calendar-cell]:not([data-disabled]):not([data-outside-visible-months])`;

	return Array.from(node.querySelectorAll(selectableSelector)).filter((el): el is HTMLElement =>
		isHTMLElement(el)
	);
}

/**
 * A helper function to extract the date from the `data-value`
 * attribute of a date cell and set it as the placeholder value.
 *
 * Shared between the calendar and range calendar builders.
 *
 * @param node - The node to extract the date from.
 * @param placeholder - The placeholder value store which will be set to the extracted date.
 */
export function setPlaceholderToNodeValue(node: HTMLElement, placeholder: Writable<DateValue>) {
	const cellValue = node.getAttribute('data-value');
	if (!cellValue) return;
	placeholder.set(parseStringToDateValue(cellValue, get(placeholder)));
}
