import { testKbd as kbd } from './../utils.js';
import { render, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DatePickerTest from './DatePickerTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned, today } from '@internationalized/date';
import { tick } from 'svelte';
import { sleep } from '$lib/internal/helpers';
import type { CreateDatePickerProps } from '$lib';

const calendarDateToday = today('America/New_York');
const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, 'America/New_York');

const narrowWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const longWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function setup(props: CreateDatePickerProps = {}) {
	const user = userEvent.setup();
	const returned = render(DatePickerTest, props);
	const trigger = returned.getByTestId('trigger');
	return {
		...returned,
		user,
		trigger,
	};
}

async function open(props: CreateDatePickerProps = {}) {
	const returned = setup(props);
	await returned.user.click(returned.trigger);
	const calendar = returned.getByTestId('calendar');
	expect(calendar).toBeVisible();
	return {
		...returned,
		calendar,
	};
}

describe('DatePicker', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = setup();

			expect(await axe(container)).toHaveNoViolations();
		});
	});
	describe('Props', () => {
		test('populated with defaultValue - CalendarDate', async () => {
			const { getByTestId, user, trigger } = setup({
				defaultValue: calendarDate,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(calendarDate.month));
			expect(daySegment).toHaveTextContent(String(calendarDate.day));
			expect(yearSegment).toHaveTextContent(String(calendarDate.year));
			expect(insideValue).toHaveTextContent(calendarDate.toString());

			await user.click(trigger);

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = calendar.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDate.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});
		test('populated with defaultValue - CalendarDateTime', async () => {
			const { getByTestId, user, trigger } = setup({
				defaultValue: calendarDateTime,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const hourSegment = getByTestId('hour');
			const minuteSegment = getByTestId('minute');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(calendarDateTime.month));
			expect(daySegment).toHaveTextContent(String(calendarDateTime.day));
			expect(yearSegment).toHaveTextContent(String(calendarDateTime.year));
			expect(hourSegment).toHaveTextContent(String(calendarDateTime.hour));
			expect(minuteSegment).toHaveTextContent(String(calendarDateTime.minute));
			expect(insideValue).toHaveTextContent(calendarDateTime.toString());

			await user.click(trigger);

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = calendar.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('populated with defaultValue - ZonedDateTime', async () => {
			const { getByTestId, trigger, user } = setup({
				defaultValue: zonedDateTime,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const hourSegment = getByTestId('hour');
			const minuteSegment = getByTestId('minute');
			const dayPeriodSegment = getByTestId('dayPeriod');
			const timeZoneSegment = getByTestId('timeZoneName');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(zonedDateTime.month));
			expect(daySegment).toHaveTextContent(String(zonedDateTime.day));
			expect(yearSegment).toHaveTextContent(String(zonedDateTime.year));
			expect(hourSegment).toHaveTextContent(String(zonedDateTime.hour));
			expect(minuteSegment).toHaveTextContent(String(zonedDateTime.minute));
			expect(dayPeriodSegment).toHaveTextContent('PM');
			expect(timeZoneSegment).toHaveTextContent(String('EST'));
			expect(insideValue).toHaveTextContent(zonedDateTime.toString());

			await user.click(trigger);

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = calendar.querySelector('[data-selected]');
			expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

			const heading = getByTestId('heading');
			expect(heading).toHaveTextContent('January 1980');
		});

		test('month navigation', async () => {
			const { getByTestId, user, trigger } = setup({
				defaultValue: zonedDateTime,
			});

			await user.click(trigger);

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

		test('prevent deselection', async () => {
			const { getByTestId, user, trigger } = setup({
				defaultValue: zonedDateTime,
				preventDeselect: true,
			});

			await user.click(trigger);

			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const selectedDay = calendar.querySelector('[data-selected]') as HTMLElement;
			expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

			await user.click(selectedDay);

			const selectedDayAfterClick = calendar.querySelector('[data-selected]') as HTMLElement;
			expect(selectedDayAfterClick).toHaveTextContent(String(zonedDateTime.day));
		});

		test('selection with mouse', async () => {
			const { getByTestId, user, trigger } = setup({
				defaultPlaceholder: zonedDateTime,
			});
			await user.click(trigger);
			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();
			const secondDayInMonth = getByTestId('month-1-date-2');
			await user.click(secondDayInMonth);
			expect(secondDayInMonth).toHaveAttribute('data-selected');

			const newDate = zonedDateTime.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
		});

		test('selection with keyboard', async () => {
			const { getByTestId, trigger, user } = setup({
				defaultPlaceholder: zonedDateTime,
			});
			await user.click(trigger);
			await sleep(1);
			const calendar = getByTestId('calendar');
			expect(calendar).toBeVisible();

			const secondDayInMonth = getByTestId('month-1-date-2');
			secondDayInMonth.focus();
			expect(secondDayInMonth).toHaveFocus();
			await user.keyboard(kbd.SPACE);
			await waitFor(() => expect(secondDayInMonth).toHaveAttribute('data-selected'));
			const newDate = zonedDateTime.set({ day: 2 });
			const insideValue = getByTestId('inside-value');
			expect(insideValue).toHaveTextContent(newDate.toString());
			await user.keyboard(kbd.ARROW_RIGHT);
			await user.keyboard(kbd.ENTER);

			const thirdDayInMonth = getByTestId('month-1-date-3');
			expect(thirdDayInMonth).toHaveAttribute('data-selected');
			const newDate2 = zonedDateTime.set({ day: 3 });
			const insideValue2 = getByTestId('inside-value');
			expect(insideValue2).toHaveTextContent(newDate2.toString());
		});

		test('locale changes segment positioning', async () => {
			const { getByTestId } = setup({
				locale: 'en-UK',
			});

			const field = getByTestId('field');
			const firstSegment = field.firstChild;
			// there are literals rendered between segments, so we need to skip them
			const secondSegment = field.children[2];
			const thirdSegment = field.children[4];

			expect(firstSegment).toHaveTextContent('dd');
			expect(secondSegment).toHaveTextContent('mm');
			expect(thirdSegment).toHaveTextContent('yyyy');
		});

		test('certain locales do not show day period segment', async () => {
			const { queryByTestId } = setup({
				locale: 'en-UK',
				defaultValue: calendarDateTime,
			});
			expect(queryByTestId('dayPeriod')).toBeNull();
		});

		test('certain locales do show day period segment', async () => {
			const { queryByTestId } = setup({
				defaultValue: calendarDateTime,
			});
			expect(queryByTestId('dayPeriod')).not.toBeNull();
		});
	});

	describe('Navigation', () => {
		test('focuses first segment on click', async () => {
			const { getByTestId, user } = setup();

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			expect(firstSegment).toHaveFocus();
		});

		test('increments segment on arrow up', async () => {
			const { getByTestId, user } = setup({
				defaultPlaceholder: calendarDateToday,
			});
			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(kbd.ARROW_UP);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(kbd.ARROW_UP);

			if (calendarDateToday.month === 12) {
				expect(firstSegment).toHaveTextContent(String(1));
			} else {
				expect(firstSegment).toHaveTextContent(String(calendarDateToday.month + 1));
			}
		});

		test('increments segment on arrow down', async () => {
			const user = userEvent.setup();
			const { getByTestId } = setup({
				defaultPlaceholder: calendarDateToday,
			});

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(kbd.ARROW_DOWN);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(kbd.ARROW_DOWN);
			expect(firstSegment).toHaveTextContent(String(calendarDateToday.month - 1));
		});

		test('increments segment on arrow down', async () => {
			const { getByTestId, user } = setup({
				defaultPlaceholder: calendarDateToday,
			});

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(kbd.ARROW_DOWN);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(kbd.ARROW_DOWN);
			expect(firstSegment).toHaveTextContent(String(calendarDateToday.month - 1));
		});

		test('navigates segments using arrow keys', async () => {
			const { getByTestId, user } = setup();

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const triggerSegment = getByTestId('trigger');

			await user.click(monthSegment);
			await user.keyboard(kbd.ARROW_RIGHT);
			expect(daySegment).toHaveFocus();

			await user.keyboard(kbd.ARROW_RIGHT);
			expect(yearSegment).toHaveFocus();

			await user.keyboard(kbd.ARROW_RIGHT);
			expect(triggerSegment).toHaveFocus();

			await user.keyboard(kbd.ARROW_LEFT);
			expect(yearSegment).toHaveFocus();

			await user.keyboard(kbd.ARROW_LEFT);
			expect(daySegment).toHaveFocus();

			await user.keyboard(kbd.ARROW_LEFT);
			expect(monthSegment).toHaveFocus();
		});

		test('navigates segments using tab', async () => {
			const { getByTestId, user, trigger } = setup();

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');

			await user.click(monthSegment);
			await user.keyboard(kbd.TAB);
			expect(daySegment).toHaveFocus();

			await user.keyboard(kbd.TAB);
			expect(yearSegment).toHaveFocus();

			await user.keyboard(kbd.TAB);
			expect(trigger).toHaveFocus();
		});

		test('when no time selected, selecting', async () => {
			const { getByTestId, queryByTestId, user, trigger } = setup({
				granularity: 'minute',
			});

			await user.click(trigger);

			const calendar = queryByTestId('calendar');
			expect(calendar).not.toBeNull();

			const nextButton = getByTestId('next-button');
			await user.click(nextButton);

			const hourSegment = getByTestId('hour');
			expect(hourSegment).not.toHaveTextContent(String(undefined));

			const minuteSegment = getByTestId('minute');
			expect(minuteSegment).not.toHaveTextContent(String(undefined));

			const firstDayInMonth = getByTestId('month-1-date-1');
			await user.click(firstDayInMonth);

			await tick();

			expect(hourSegment).not.toHaveTextContent(String(undefined));
			expect(minuteSegment).not.toHaveTextContent(String(undefined));
		});

		test('correct segments are rendered with placeholder', async () => {
			const { getByTestId } = setup({
				defaultPlaceholder: new CalendarDateTime(2021, 2, 1),
			});

			const segments = ['month', 'day', 'year', 'hour', 'minute', 'dayPeriod'];

			for (const segment of segments) {
				expect(getByTestId(segment)).not.toBeNull();
			}
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
			const dateFieldIds = {
				field: 'id-field',
				day: 'id-day',
				month: 'id-month',
				dayPeriod: 'id-dayPeriod',
				hour: 'id-hour',
				minute: 'id-minute',
				year: 'id-year',
				timeZoneName: 'id-timeZoneName',
				description: 'id-description',
				label: 'id-label',
				second: 'id-second',
				validation: 'id-validation',
			};

			const popoverIds = {
				content: 'id-content',
				trigger: 'id-trigger',
			};

			const calendarIds = {
				accessibleHeading: 'id-heading',
				calendar: 'id-calendar',
			};

			const { getByTestId } = await open({
				defaultValue: zonedDateTime,
				dateFieldIds,
				popoverIds,
				calendarIds,
				granularity: 'second',
			});

			const field = getByTestId('field');
			const label = getByTestId('label');
			const validation = getByTestId('validation');
			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const hourSegment = getByTestId('hour');
			const secondSegment = getByTestId('second');
			const minuteSegment = getByTestId('minute');
			const dayPeriodSegment = getByTestId('dayPeriod');
			const timeZoneSegment = getByTestId('timeZoneName');

			const descriptionEl = document.getElementById(dateFieldIds.description);
			expect(descriptionEl).toBeInTheDocument();

			expect(field.id).toBe(dateFieldIds.field);
			expect(label.id).toBe(dateFieldIds.label);
			expect(validation.id).toBe(dateFieldIds.validation);
			expect(monthSegment.id).toBe(dateFieldIds.month);
			expect(daySegment.id).toBe(dateFieldIds.day);
			expect(yearSegment.id).toBe(dateFieldIds.year);
			expect(hourSegment.id).toBe(dateFieldIds.hour);
			expect(secondSegment.id).toBe(dateFieldIds.second);
			expect(minuteSegment.id).toBe(dateFieldIds.minute);
			expect(dayPeriodSegment.id).toBe(dateFieldIds.dayPeriod);
			expect(timeZoneSegment.id).toBe(dateFieldIds.timeZoneName);
			expect(field.getAttribute('aria-describedby')).toBe(dateFieldIds.description);

			const content = getByTestId('content');
			const trigger = getByTestId('trigger');
			expect(content.id).toBe(popoverIds.content);
			expect(trigger.id).toBe(popoverIds.trigger);

			const calendar = getByTestId('calendar');
			expect(calendar.id).toBe(calendarIds.calendar);
			const accessibleHeading = document.getElementById(calendarIds.accessibleHeading);
			expect(accessibleHeading).toBeInTheDocument();
		});
	});

	test('clicking the label focuses the first segment', async () => {
		const { getByTestId, user } = setup();
		const label = getByTestId('label');
		const monthSegment = getByTestId('month');
		await user.click(label);
		expect(monthSegment).toHaveFocus();
	});
});
