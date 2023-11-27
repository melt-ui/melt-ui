import { testKbd as kbd } from '../utils.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CalendarTest from './CalendarTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned, type DateValue } from '@internationalized/date';
import { writable } from 'svelte/store';
import { tick } from 'svelte';
import CalendarMultiTest from './CalendarMultiTest.svelte';
import type { CreateCalendarProps } from '$lib/builders/index.js';

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, 'America/New_York');

const controlledCalendarDate = writable<DateValue | undefined>(calendarDate);
const controlledCalendarDateTime = writable<DateValue | undefined>(calendarDateTime);
const controlledZonedDateTime = writable<DateValue | undefined>(zonedDateTime);

function setup(props: CreateCalendarProps = {}) {
	const user = userEvent.setup();
	const returned = render(CalendarTest, props);
	const calendar = returned.getByTestId('calendar');
	expect(calendar).toBeVisible();
	return {
		...returned,
		user,
		calendar,
	};
}

function setupMulti(props: CreateCalendarProps<true> = {}) {
	const user = userEvent.setup();
	const returned = render(CalendarMultiTest, props);
	const calendar = returned.getByTestId('calendar');
	expect(calendar).toBeVisible();
	return {
		...returned,
		user,
		calendar,
	};
}

describe('Calendar', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(CalendarTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});
	test('populated with defaultValue - CalendarDate', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: calendarDate,
		});

		expect(calendar).toBeVisible();

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});
	test('populated with defaultValue - CalendarDateTime', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: calendarDateTime,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with defaultValue - ZonedDateTime', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: zonedDateTime,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - CalendarDate', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledCalendarDate,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - CalendarDateTime', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledCalendarDateTime,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - ZonedDateTime', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledZonedDateTime,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('month navigation', async () => {
		const { getByTestId, user } = setup({
			defaultValue: zonedDateTime,
		});

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');

		const prevButton = getByTestId('prev-button');
		const nextButton = getByTestId('next-button');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('February 1980');

		await user.click(prevButton);
		expect(heading).toHaveTextContent('January 1980');

		await user.click(prevButton);
		expect(heading).toHaveTextContent('December 1979');
	});

	test('allow deselection', async () => {
		const { calendar, queryByTestId, user } = setup({
			defaultValue: zonedDateTime,
		});

		const selectedDay = calendar.querySelector('[data-selected]') as HTMLElement;
		expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

		await user.click(selectedDay);

		await tick();
		const insideValue = queryByTestId('inside-value');
		expect(insideValue).toHaveTextContent('undefined');
	});

	test('selection with mouse', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: zonedDateTime,
		});

		const secondDayInMonth = getByTestId('month-0-date-2');
		await user.click(secondDayInMonth);
		expect(secondDayInMonth).toHaveAttribute('data-selected');

		const newDate = zonedDateTime.set({ day: 2 });
		const insideValue = getByTestId('inside-value');
		expect(insideValue).toHaveTextContent(newDate.toString());
	});

	test('selection with keyboard', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: zonedDateTime,
		});

		const secondDayInMonth = getByTestId('month-0-date-2');
		secondDayInMonth.focus();
		await user.keyboard(kbd.SPACE);
		expect(secondDayInMonth).toHaveAttribute('data-selected');
		const newDate = zonedDateTime.set({ day: 2 });
		const insideValue = getByTestId('inside-value');
		expect(insideValue).toHaveTextContent(newDate.toString());
		await user.keyboard(kbd.ARROW_RIGHT);
		await user.keyboard(kbd.ENTER);

		const thirdDayInMonth = getByTestId('month-0-date-3');
		expect(thirdDayInMonth).toHaveAttribute('data-selected');
		const newDate2 = zonedDateTime.set({ day: 3 });
		const insideValue2 = getByTestId('inside-value');
		expect(insideValue2).toHaveTextContent(newDate2.toString());
	});

	test('should display multiple months with numberOfMonths prop', async () => {
		const { getByTestId, calendar, user } = setup({
			defaultValue: calendarDateTime,
			numberOfMonths: 2,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January - February 1980');

		const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();

		const firstMonthDay = getByTestId('month-0-date-12');
		expect(firstMonthDay).toHaveTextContent('12');
		expect(firstMonthDay).toHaveAttribute('data-value', firstMonthDayDateStr);

		const secondMonthDay = getByTestId('month-1-date-15');

		const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();

		expect(secondMonthDay).toHaveTextContent('15');
		expect(secondMonthDay).toHaveAttribute('data-value', secondMonthDayDateStr);

		const prevButton = getByTestId('prev-button');
		const nextButton = getByTestId('next-button');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('February - March 1980');
		expect(firstMonthDay).not.toHaveAttribute('data-value', firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent('January - February 1980');
		await user.click(prevButton);
		expect(heading).toHaveTextContent('December 1979 - January 1980');
	});

	test('multiple months (paged navigation)', async () => {
		const { getByTestId, calendar, user } = setup({
			defaultValue: calendarDateTime,
			numberOfMonths: 2,
			pagedNavigation: true,
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January - February 1980');

		const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();

		const firstMonthDay = getByTestId('month-0-date-12');
		expect(firstMonthDay).toHaveTextContent('12');
		expect(firstMonthDay).toHaveAttribute('data-value', firstMonthDayDateStr);

		const secondMonthDay = getByTestId('month-1-date-15');

		const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();

		expect(secondMonthDay).toHaveTextContent('15');
		expect(secondMonthDay).toHaveAttribute('data-value', secondMonthDayDateStr);
		const prevButton = getByTestId('prev-button');
		const nextButton = getByTestId('next-button');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('March - April 1980');
		expect(firstMonthDay).not.toHaveAttribute('data-value', firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent('January - February 1980');
		await user.click(prevButton);
		expect(heading).toHaveTextContent('November - December 1979');
	});

	test('fixedWeeks always renders 6 weeks', async () => {
		const valueStore = writable(calendarDate);

		const { getByTestId, queryByTestId, user } = setup({
			value: valueStore,
			fixedWeeks: true,
		});

		const nextButton = getByTestId('next-button');
		const prevButton = getByTestId('prev-button');

		for (let i = 0; i < 12; i++) {
			await user.click(nextButton);
			expect(queryByTestId('week-6')).not.toBeNull();
		}

		valueStore.set(calendarDate);

		for (let i = 0; i < 12; i++) {
			await user.click(prevButton);
			expect(queryByTestId('week-6')).not.toBeNull();
		}
	});
	test('controlled value should update selected value', async () => {
		const valueStore = writable<DateValue | undefined>(undefined);

		const { getByTestId } = setup({
			value: valueStore,
		});

		const insideValue = getByTestId('inside-value');
		expect(insideValue).toHaveTextContent('undefined');
		valueStore.set(calendarDate);

		await tick();
		expect(insideValue).toHaveTextContent('1980-01-20');
		valueStore.set(new CalendarDate(2023, 10, 11));

		await tick();
		expect(insideValue).toHaveTextContent('2023-10-11');
	});

	test('controlled placeholder should change view', async () => {
		const placeholderStore = writable<DateValue>(calendarDate);
		const { getByTestId } = setup({
			defaultValue: calendarDate,
			placeholder: placeholderStore,
		});

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');

		const insideValue = getByTestId('inside-value');
		expect(insideValue).toHaveTextContent('1980-01-20');

		placeholderStore.set(new CalendarDate(2023, 10, 11));

		await tick();
		expect(heading).toHaveTextContent('October 2023');
		expect(insideValue).toHaveTextContent('1980-01-20');
	});

	test('calendar does not navigate before minValue', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDate,
			minValue: new CalendarDate(1979, 11, 25),
		});

		const prevButton = getByTestId('prev-button');
		await user.click(prevButton);
		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('December 1979');
		expect(prevButton).not.toHaveAttribute('aria-disabled', 'true');
		expect(prevButton).not.toHaveAttribute('data-disabled');
		await user.click(prevButton);
		expect(heading).toHaveTextContent('November 1979');

		expect(prevButton).toHaveAttribute('aria-disabled', 'true');
		expect(prevButton).toHaveAttribute('data-disabled');

		await user.click(prevButton);
		expect(heading).toHaveTextContent('November 1979');
	});

	test('calendar does not navigate after maxValue', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDate,
			maxValue: new CalendarDate(1980, 4, 1),
		});

		const nextButton = getByTestId('next-button');
		await user.click(nextButton);
		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('February 1980');
		await user.click(nextButton);
		expect(heading).toHaveTextContent('March 1980');

		expect(nextButton).not.toHaveAttribute('aria-disabled', 'true');
		expect(nextButton).not.toHaveAttribute('data-disabled');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('April 1980');

		expect(nextButton).toHaveAttribute('aria-disabled', 'true');
		expect(nextButton).toHaveAttribute('data-disabled');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('April 1980');
	});

	test('multiple select default Value', async () => {
		const day1 = new CalendarDate(1980, 1, 2);
		const day2 = new CalendarDate(1980, 1, 5);

		const { getByTestId, container } = setupMulti({
			defaultValue: [day1, day2],
		});

		const calendar = getByTestId('calendar');
		expect(calendar).toBeVisible();

		const selectedDays = container.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(2);

		expect(selectedDays[0]).toHaveTextContent(String(day1.day));
		expect(selectedDays[1]).toHaveTextContent(String(day2.day));
	});

	test('multiple select controlled value', async () => {
		const day1 = new CalendarDate(1980, 1, 2);
		const day2 = new CalendarDate(1980, 1, 5);
		const value = writable([day1, day2]);
		const { getByTestId, container } = render(CalendarMultiTest, {
			value,
		});

		const calendar = getByTestId('calendar');
		expect(calendar).toBeVisible();

		const selectedDays = container.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(2);

		expect(selectedDays[0]).toHaveTextContent(String(day1.day));
		expect(selectedDays[1]).toHaveTextContent(String(day2.day));
	});

	test('multiple select - prevent deselect false (default)', async () => {
		const day1 = new CalendarDate(1980, 1, 2);
		const day2 = new CalendarDate(1980, 1, 5);

		const { calendar, user } = setupMulti({
			defaultValue: [day1, day2],
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(2);

		expect(selectedDays[0]).toHaveTextContent(String(day1.day));
		expect(selectedDays[1]).toHaveTextContent(String(day2.day));

		await user.click(selectedDays[0]);
		const selectedDaysAfterClick = calendar.querySelectorAll('[data-selected]');
		expect(selectedDaysAfterClick).toHaveLength(1);
		expect(selectedDaysAfterClick[0]).toHaveTextContent(String(day2.day));
	});

	test('multiple select -  prevent deselect true', async () => {
		const day1 = new CalendarDate(1980, 1, 2);
		const day2 = new CalendarDate(1980, 1, 5);

		const { calendar, user } = setupMulti({
			defaultValue: [day1, day2],
			preventDeselect: true,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(2);

		expect(selectedDays[0]).toHaveTextContent(String(day1.day));
		expect(selectedDays[1]).toHaveTextContent(String(day2.day));

		await user.click(selectedDays[0]);
		const selectedDaysAfterClick = calendar.querySelectorAll('[data-selected]');
		expect(selectedDaysAfterClick).toHaveLength(2);
		expect(selectedDaysAfterClick[0]).toHaveTextContent(String(day1.day));
		expect(selectedDaysAfterClick[1]).toHaveTextContent(String(day2.day));
	});

	test('multiple select - allow deselect', async () => {
		const day1 = new CalendarDate(1980, 1, 2);
		const day2 = new CalendarDate(1980, 1, 5);

		const { getByTestId, container } = setupMulti({
			defaultValue: [day1, day2],
		});

		const calendar = getByTestId('calendar');
		expect(calendar).toBeVisible();

		const selectedDays = container.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(2);
	});

	test('overridable with multiple', async () => {
		const day1 = new CalendarDate(1980, 1, 10);
		const { getByTestId, calendar, user } = setupMulti({
			defaultValue: [day1],
			onValueChange: ({ curr, next }) => {
				if (next && next.length > 2) {
					return curr;
				} else {
					return next;
				}
			},
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(1);

		const thirdDayInMonth = getByTestId('month-0-date-3');

		await user.click(thirdDayInMonth);

		const selectedDaysAfterClick = calendar.querySelectorAll('[data-selected]');
		expect(selectedDaysAfterClick).toHaveLength(2);

		const fifthDayInMonth = getByTestId('month-0-date-5');

		await user.click(fifthDayInMonth);

		const selectedDaysAfterClick2 = calendar.querySelectorAll('[data-selected]');
		expect(selectedDaysAfterClick2).toHaveLength(2);
	});

	test('overridable with single', async () => {
		const overrideDay = new CalendarDate(1980, 1, 25);

		const { getByTestId, calendar, user } = setup({
			defaultValue: calendarDate,
			onValueChange: () => {
				return overrideDay;
			},
		});

		const selectedDay = calendar.querySelector('[data-selected]');
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		const thirdDayInMonth = getByTestId('month-0-date-3');
		await user.click(thirdDayInMonth);

		const selectedDayAfterClick = calendar.querySelector('[data-selected]');
		expect(selectedDayAfterClick).toHaveTextContent(String(overrideDay.day));
	});

	test('unavailable dates behavior', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDate,
			isDateUnavailable: (date) => {
				return date.day === 3;
			},
		});

		const thirdDayInMonth = getByTestId('month-0-date-3');
		expect(thirdDayInMonth).toHaveAttribute('data-unavailable');
		expect(thirdDayInMonth).toHaveAttribute('aria-disabled', 'true');
		await user.click(thirdDayInMonth);
		expect(thirdDayInMonth).not.toHaveAttribute('data-selected');
	});

	test('disabled prop prevents calendar focus & interaction', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDate,
			disabled: true,
		});

		const calendar = getByTestId('calendar');
		expect(calendar).toHaveAttribute('data-disabled');

		const grid = getByTestId('grid-0');
		expect(grid).toHaveAttribute('aria-disabled', 'true');
		expect(grid).toHaveAttribute('data-disabled');

		const firstDayOfMonth = getByTestId('month-0-date-1');
		await user.click(firstDayOfMonth);
		expect(firstDayOfMonth).not.toHaveFocus();
	});

	test('readonly prop prevents selecting dates but allows focus', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDate,
			readonly: true,
		});

		const calendar = getByTestId('calendar');
		expect(calendar).toHaveAttribute('data-readonly');

		const grid = getByTestId('grid-0');
		expect(grid).toHaveAttribute('aria-readonly', 'true');
		expect(grid).toHaveAttribute('data-readonly');

		const firstDayOfMonth = getByTestId('month-0-date-1');
		await user.click(firstDayOfMonth);
		expect(firstDayOfMonth).toHaveFocus();
		expect(firstDayOfMonth).not.toHaveAttribute('data-selected');
	});
});
