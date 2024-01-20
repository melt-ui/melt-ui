import type { CreateRangeCalendarProps, DateRange } from '$lib';
import { CalendarDate, CalendarDateTime, toZoned, type DateValue } from '@internationalized/date';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { tick } from 'svelte';
import { writable } from 'svelte/store';
import { describe } from 'vitest';
import { testKbd as kbd } from '../utils.js';
import RangeCalendarTest from './RangeCalendarTest.svelte';

const calendarDateRange = {
	start: new CalendarDate(1980, 1, 20),
	end: new CalendarDate(1980, 1, 25),
};

const calendarDateTimeRange = {
	start: new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0),
	end: new CalendarDateTime(1980, 1, 25, 12, 30, 0, 0),
};

const zonedDateTimeRange = {
	start: toZoned(calendarDateTimeRange.start, 'America/New_York'),
	end: toZoned(calendarDateTimeRange.end, 'America/New_York'),
};

const controlledCalendarDateRange = writable<DateRange>(calendarDateRange);
const controlledCalendarDateTimeRange = writable<DateRange>(calendarDateTimeRange);
const controlledZonedDateTimeRange = writable<DateRange>(zonedDateTimeRange);

const narrowWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const longWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function setup(props: CreateRangeCalendarProps = {}) {
	const user = userEvent.setup();
	const returned = render(RangeCalendarTest, props);
	const calendar = returned.getByTestId('calendar');
	expect(calendar).toBeVisible();
	return {
		...returned,
		user,
		calendar,
	};
}

describe('Range Calendar', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(RangeCalendarTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});
	test('populated with defaultValue - CalendarDate', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: calendarDateRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});
	test('populated with defaultValue - CalendarDateTime', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: calendarDateTimeRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with defaultValue - ZonedDateTime', async () => {
		const { getByTestId, calendar } = setup({
			defaultValue: zonedDateTimeRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - CalendarDate', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledCalendarDateRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - CalendarDateTime', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledCalendarDateTimeRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('populated with controlled value - CalendarDateTime', async () => {
		const { getByTestId, calendar } = setup({
			value: controlledZonedDateTimeRange,
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');
	});

	test('month navigation', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateRange,
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

	test('selection after range selected resets range', async () => {
		const { getByTestId, calendar, user } = setup({
			defaultValue: calendarDateRange,
		});

		const startValue = getByTestId('start-value');
		const endValue = getByTestId('end-value');

		expect(startValue).toHaveTextContent(String(calendarDateRange.start));
		expect(endValue).toHaveTextContent(String(calendarDateRange.end));

		const fifthDayInMonth = getByTestId('month-1-date-5');
		await user.click(fifthDayInMonth);
		expect(fifthDayInMonth).toHaveFocus();

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(1);
		expect(startValue).toHaveTextContent(String(undefined));
		expect(endValue).toHaveTextContent(String(undefined));
		const seventhDayInMonth = getByTestId('month-1-date-7');
		await user.click(seventhDayInMonth);
		await tick();
		expect(calendar.querySelectorAll('[data-selected]')).toHaveLength(3);
	});

	test('selection with keyboard', async () => {
		const { getByTestId, user, calendar } = setup({
			defaultPlaceholder: calendarDateRange.start,
		});

		const secondDayInMonth = getByTestId('month-1-date-2');
		const thirdDayInMonth = getByTestId('month-1-date-3');
		const fourthDayInMonth = getByTestId('month-1-date-4');
		secondDayInMonth.focus();
		await user.keyboard(kbd.SPACE);
		expect(secondDayInMonth).toHaveAttribute('data-selected');

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(thirdDayInMonth).toHaveFocus();
		await tick();
		expect(thirdDayInMonth).toHaveAttribute('data-focused');
		await user.keyboard(kbd.ARROW_RIGHT);
		await tick();
		expect(thirdDayInMonth).toHaveAttribute('data-highlighted');
		expect(fourthDayInMonth).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(fourthDayInMonth).toHaveAttribute('data-selected');

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(3);
	});

	test('should display multiple months with numberOfMonths prop', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateRange,
			numberOfMonths: 2,
		});

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January - February 1980');

		const firstMonthDay = getByTestId('month-1-date-12');
		expect(firstMonthDay).toHaveTextContent('12');

		const secondMonthDay = getByTestId('month-1-date-15');

		expect(secondMonthDay).toHaveTextContent('15');

		const prevButton = getByTestId('prev-button');
		const nextButton = getByTestId('next-button');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('February - March 1980');

		await user.click(prevButton);
		expect(heading).toHaveTextContent('January - February 1980');
		await user.click(prevButton);
		expect(heading).toHaveTextContent('December 1979 - January 1980');
	});

	test('multiple months (paged navigation)', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateRange,
			numberOfMonths: 2,
			pagedNavigation: true,
		});

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January - February 1980');

		const firstMonthDayDateStr = calendarDateRange.start.set({ day: 12 }).toString();

		const firstMonthDay = getByTestId('month-1-date-12');
		expect(firstMonthDay).toHaveTextContent('12');
		expect(firstMonthDay).toHaveAttribute('data-value', firstMonthDayDateStr);

		const secondMonthDay = getByTestId('month-2-date-15');

		const secondMonthDayDateStr = calendarDateRange.start.set({ day: 15, month: 2 }).toString();

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
		const { getByTestId, queryByTestId, user } = setup({
			value: controlledCalendarDateRange,
			fixedWeeks: true,
		});

		const nextButton = getByTestId('next-button');
		const prevButton = getByTestId('prev-button');

		for (let i = 0; i < 12; i++) {
			await user.click(nextButton);
			expect(queryByTestId('week-6')).not.toBeNull();
		}

		for (let i = 0; i < 12; i++) {
			await user.click(prevButton);
			expect(queryByTestId('week-6')).not.toBeNull();
		}
	});
	test('controlled value should update selected value', async () => {
		const valueStore = writable<DateRange>(undefined);

		const { getByTestId } = setup({
			value: valueStore,
		});

		const startValue = getByTestId('start-value');
		expect(startValue).toHaveTextContent('undefined');
		const endValue = getByTestId('end-value');
		expect(endValue).toHaveTextContent('undefined');
		valueStore.set(calendarDateRange);

		await tick();

		expect(startValue).toHaveTextContent('1980-01-20');
		expect(endValue).toHaveTextContent('1980-01-25');
		valueStore.set({
			start: new CalendarDate(2023, 8, 10),
			end: new CalendarDate(2023, 10, 11),
		});

		await tick();
		expect(startValue).toHaveTextContent('2023-08-10');
		expect(endValue).toHaveTextContent('2023-10-11');
	});

	test('controlled placeholder should change view', async () => {
		const placeholderStore = writable<DateValue>(calendarDateRange.start);
		const { getByTestId } = setup({
			defaultValue: calendarDateRange,
			placeholder: placeholderStore,
		});

		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('January 1980');

		const startValue = getByTestId('start-value');
		expect(startValue).toHaveTextContent('1980-01-20');
		const endValue = getByTestId('end-value');
		expect(endValue).toHaveTextContent('1980-01-25');

		placeholderStore.set(new CalendarDate(2023, 10, 11));

		await tick();
		expect(heading).toHaveTextContent('October 2023');
		expect(startValue).toHaveTextContent('1980-01-20');
		expect(endValue).toHaveTextContent('1980-01-25');
	});

	test('calendar does not navigate before minValue', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateRange,
			minValue: new CalendarDate(1979, 11, 25),
		});

		const prevButton = getByTestId('prev-button');
		await user.click(prevButton);
		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('December 1979');
		expect(prevButton).not.toBeDisabled();
		expect(prevButton).not.toHaveAttribute('aria-disabled', 'true');
		await user.click(prevButton);
		expect(heading).toHaveTextContent('November 1979');

		expect(prevButton).toBeDisabled();
		expect(prevButton).toHaveAttribute('aria-disabled', 'true');

		await user.click(prevButton);
		expect(heading).toHaveTextContent('November 1979');
	});

	test('calendar does not navigate after maxValue', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateRange,
			maxValue: new CalendarDate(1980, 4, 1),
		});

		const nextButton = getByTestId('next-button');
		await user.click(nextButton);
		const heading = getByTestId('heading');
		expect(heading).toHaveTextContent('February 1980');
		await user.click(nextButton);
		expect(heading).toHaveTextContent('March 1980');
		expect(nextButton).not.toBeDisabled();
		expect(nextButton).not.toHaveAttribute('aria-disabled', 'true');
		await user.click(nextButton);
		expect(heading).toHaveTextContent('April 1980');

		expect(nextButton).toBeDisabled();
		expect(nextButton).toHaveAttribute('aria-disabled', 'true');

		await user.click(nextButton);
		expect(heading).toHaveTextContent('April 1980');
	});

	test('overridable store functions as expected', async () => {
		const overrideDay = {
			start: new CalendarDate(1980, 2, 25),
			end: new CalendarDate(1980, 2, 27),
		};

		const { getByTestId, calendar, user } = setup({
			defaultValue: calendarDateRange,
			onValueChange: () => {
				return overrideDay;
			},
		});

		const selectedDays = calendar.querySelectorAll('[data-selected]');
		expect(selectedDays).toHaveLength(6);

		const thirdDayInMonth = getByTestId('month-1-date-3');
		await user.click(thirdDayInMonth);
		await tick();

		const selectedDaysAfterClick = getByTestId('calendar').querySelectorAll('[data-selected]');
		expect(selectedDaysAfterClick).toHaveLength(3);
	});

	test('unavailable dates behavior', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDateRange.start,
			isDateUnavailable: (date) => {
				return date.day === 3;
			},
		});

		const thirdDayInMonth = getByTestId('month-1-date-3');
		expect(thirdDayInMonth).toHaveAttribute('data-unavailable');
		expect(thirdDayInMonth).toHaveAttribute('aria-disabled', 'true');
		await user.click(thirdDayInMonth);
		expect(thirdDayInMonth).not.toHaveAttribute('data-selected');
	});

	test('disabled dates behavior', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDateRange.start,
			isDateDisabled: (date) => {
				return date.day === 3;
			},
		});

		const thirdDayInMonth = getByTestId('month-1-date-3');
		expect(thirdDayInMonth).toHaveAttribute('data-disabled');
		expect(thirdDayInMonth).toHaveAttribute('aria-disabled', 'true');
		await user.click(thirdDayInMonth);
		expect(thirdDayInMonth).not.toHaveAttribute('data-selected');
	});

	test('Selection through disabled with double click doesnt select dates', async () => {
		const { getByTestId, calendar, user } = setup({
			defaultPlaceholder: calendarDateRange.start,
			isDateDisabled: (date) => {
				return date.day === 3;
			},
		});

		const firstDayInMonth = getByTestId('month-1-date-1');
		await user.click(firstDayInMonth);
		expect(firstDayInMonth).toHaveAttribute('data-selected');

		const fifthDayInMonth = getByTestId('month-1-date-5');
		await user.dblClick(fifthDayInMonth);

		expect(calendar.querySelectorAll('[data-selected]')).toHaveLength(1);
	});

	test('weekdayFormat prop - `"narrow"` (default)', async () => {
		const { getByTestId } = setup();

		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}
	});

	test('weekdayFormat prop - `"short"`', async () => {
		const { getByTestId } = setup({
			weekdayFormat: 'short',
		});

		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}
	});

	test('weekdayFormat prop - `"long"`', async () => {
		const { getByTestId } = setup({
			weekdayFormat: 'long',
		});

		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}
	});

	test('dynamically change weekdayFormat option', async () => {
		const { getByTestId, user } = setup();

		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}

		const cycleButton = getByTestId('cycle-weekday-format');
		await user.click(cycleButton);

		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}

		await user.click(cycleButton);

		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayElement = getByTestId(`weekday-${i}`);
			expect(weekdayElement).toHaveTextContent(weekday);
		}
	});

	test('custom ids are applied when provided', async () => {
		const ids = {
			accessibleHeading: 'id-heading',
			calendar: 'id-calendar',
		};

		const { container, calendar } = setup({
			ids,
		});

		const heading = container.querySelector(`#${ids.accessibleHeading}`);
		expect(heading).toBeInTheDocument();
		expect(calendar.id).toBe(ids.calendar);
	});
});
