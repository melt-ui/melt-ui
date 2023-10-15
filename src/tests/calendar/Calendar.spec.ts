import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CalendarTest from './CalendarTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned, type DateValue } from '@internationalized/date';
import { writable } from 'svelte/store';
import { tick } from 'svelte';

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, 'America/New_York');

describe('DatePicker', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(CalendarTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});
	describe('Props', () => {
		test('populated with defaultValue - CalendarDate', async () => {
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDate,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDate.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});
		test('populated with defaultValue - CalendarDateTime', async () => {
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDateTime,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('populated with defaultValue - ZonedDateTime', async () => {
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: zonedDateTime,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('month navigation', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultValue: zonedDateTime,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

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
			const user = userEvent.setup();
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: zonedDateTime,
				allowDeselect: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]') as HTMLElement;
			expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

			await user.click(selectedDay);

			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent('undefined');
		});

		test('selection with mouse', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultPlaceholder: zonedDateTime,
				allowDeselect: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();
			const secondDayInMonth = getByTestId('month-0-date-2');
			await user.click(secondDayInMonth);
			expect(secondDayInMonth).toHaveAttribute('data-selected');

			const newDate = zonedDateTime.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
		});

		test('selection with keyboard', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultPlaceholder: zonedDateTime,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();
			const secondDayInMonth = getByTestId('month-0-date-2');
			secondDayInMonth.focus();
			await user.keyboard(`{${kbd.SPACE}}`);
			expect(secondDayInMonth).toHaveAttribute('data-selected');
			const newDate = zonedDateTime.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
			await user.keyboard(`{${kbd.ENTER}}`);

			const thirdDayInMonth = getByTestId('month-0-date-3');
			expect(thirdDayInMonth).toHaveAttribute('data-selected');
			const newDate2 = zonedDateTime.set({ day: 3 });
			const insideValue2 = getByTestId('inside-value');
			expect(insideValue2).toHaveTextContent(newDate2.toString());
		});

		test('multiple months', async () => {
			const user = userEvent.setup();
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDateTime,
				numberOfMonths: 2,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
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
			const user = userEvent.setup();
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDateTime,
				numberOfMonths: 2,
				pagedNavigation: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
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

			const { getByTestId, queryByTestId } = render(CalendarTest, {
				value: valueStore,
				fixedWeeks: true,
			});

			const nextButton = getByTestId('next-button');
			const prevButton = getByTestId('prev-button');

			for (let i = 0; i < 12; i++) {
				await userEvent.click(nextButton);
				expect(queryByTestId('week-6')).not.toBeNull();
			}

			valueStore.set(calendarDate);

			for (let i = 0; i < 12; i++) {
				await userEvent.click(prevButton);
				expect(queryByTestId('week-6')).not.toBeNull();
			}
		});
		test('controlled value should update selected value', async () => {
			const valueStore = writable<DateValue | undefined>(undefined);

			const { getByTestId } = render(CalendarTest, {
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
			const placeholderStore = writable<DateValue>(undefined);
			const { getByTestId } = render(CalendarTest, {
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
	});
});