import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CalendarTest from './CalendarTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned } from '@internationalized/date';

const calendarDateOther = new CalendarDate(1980, 1, 20);
const calendarDateTimeOther = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTimeOther = toZoned(calendarDateTimeOther, 'America/New_York');

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
				defaultValue: calendarDateOther,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateOther.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});
		test('populated with defaultValue - CalendarDateTime', async () => {
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDateTimeOther,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateTimeOther.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('populated with defaultValue - ZonedDateTime', async () => {
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: zonedDateTimeOther,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(zonedDateTimeOther.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('month navigation', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultValue: zonedDateTimeOther,
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
				defaultValue: zonedDateTimeOther,
				allowDeselect: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]') as HTMLElement;
			expect(selectedDay).toHaveTextContent(String(zonedDateTimeOther.day));

			await user.click(selectedDay);

			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent('undefined');
		});

		test('selection with mouse', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultPlaceholderValue: zonedDateTimeOther,
				allowDeselect: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();
			const secondDayInMonth = getByTestId('month-0-date-2');
			await user.click(secondDayInMonth);
			expect(secondDayInMonth).toHaveAttribute('data-selected');

			const newDate = zonedDateTimeOther.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
		});

		test('selection with keyboard', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(CalendarTest, {
				defaultPlaceholderValue: zonedDateTimeOther,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();
			const secondDayInMonth = getByTestId('month-0-date-2');
			secondDayInMonth.focus();
			await user.keyboard(`{${kbd.SPACE}}`);
			expect(secondDayInMonth).toHaveAttribute('data-selected');
			const newDate = zonedDateTimeOther.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
			await user.keyboard(`{${kbd.ENTER}}`);

			const thirdDayInMonth = getByTestId('month-0-date-3');
			expect(thirdDayInMonth).toHaveAttribute('data-selected');
			const newDate2 = zonedDateTimeOther.set({ day: 3 });
			const insideValue2 = getByTestId('inside-value');
			expect(insideValue2).toHaveTextContent(newDate2.toString());
		});

		test('multiple months', async () => {
			const user = userEvent.setup();
			const { getByTestId, container } = render(CalendarTest, {
				defaultValue: calendarDateTimeOther,
				numberOfMonths: 2,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateTimeOther.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January - February 1980');

			const firstMonthDayDateStr = calendarDateTimeOther.set({ day: 12 }).toString();

			const firstMonthDay = getByTestId('month-0-date-12');
			expect(firstMonthDay).toHaveTextContent('12');
			expect(firstMonthDay).toHaveAttribute('data-value', firstMonthDayDateStr);

			const secondMonthDay = getByTestId('month-1-date-15');

			const secondMonthDayDateStr = calendarDateTimeOther.set({ day: 15, month: 2 }).toString();

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
				defaultValue: calendarDateTimeOther,
				numberOfMonths: 2,
				pagedNavigation: true,
			});

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = container.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateTimeOther.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January - February 1980');

			const firstMonthDayDateStr = calendarDateTimeOther.set({ day: 12 }).toString();

			const firstMonthDay = getByTestId('month-0-date-12');
			expect(firstMonthDay).toHaveTextContent('12');
			expect(firstMonthDay).toHaveAttribute('data-value', firstMonthDayDateStr);

			const secondMonthDay = getByTestId('month-1-date-15');

			const secondMonthDayDateStr = calendarDateTimeOther.set({ day: 15, month: 2 }).toString();

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
	});
});
