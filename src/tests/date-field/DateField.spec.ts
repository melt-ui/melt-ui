import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DateFieldTest from './DateFieldTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned, today } from '@internationalized/date';

const calendarDateToday = today('America/New_York');
const calendarDateOther = new CalendarDate(1980, 1, 20);
const calendarDateTimeOther = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTimeOther = toZoned(calendarDateTimeOther, 'America/New_York');

describe('DateField', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(DateFieldTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});

	describe('Props', () => {
		test('segments populated with defaultValue - CalendarDate', async () => {
			const { getByTestId } = render(DateFieldTest, {
				defaultValue: calendarDateOther,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(calendarDateOther.month));
			expect(daySegment).toHaveTextContent(String(calendarDateOther.day));
			expect(yearSegment).toHaveTextContent(String(calendarDateOther.year));
			expect(insideValue).toHaveTextContent(calendarDateOther.toString());
		});
		test('segments populated with defaultValue - CalendarDateTime', async () => {
			const { getByTestId } = render(DateFieldTest, {
				defaultValue: calendarDateTimeOther,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const hourSegment = getByTestId('hour');
			const minuteSegment = getByTestId('minute');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(calendarDateTimeOther.month));
			expect(daySegment).toHaveTextContent(String(calendarDateTimeOther.day));
			expect(yearSegment).toHaveTextContent(String(calendarDateTimeOther.year));
			expect(hourSegment).toHaveTextContent(String(calendarDateTimeOther.hour));
			expect(minuteSegment).toHaveTextContent(String(calendarDateTimeOther.minute));
			expect(insideValue).toHaveTextContent(calendarDateTimeOther.toString());
		});

		test('segments populated with defaultValue - ZonedDateTime', async () => {
			const { getByTestId } = render(DateFieldTest, {
				defaultValue: zonedDateTimeOther,
			});

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');
			const hourSegment = getByTestId('hour');
			const minuteSegment = getByTestId('minute');
			const dayPeriodSegment = getByTestId('dayPeriod');
			const timeZoneSegment = getByTestId('timeZoneName');
			const insideValue = getByTestId('inside-value');

			expect(monthSegment).toHaveTextContent(String(zonedDateTimeOther.month));
			expect(daySegment).toHaveTextContent(String(zonedDateTimeOther.day));
			expect(yearSegment).toHaveTextContent(String(zonedDateTimeOther.year));
			expect(hourSegment).toHaveTextContent(String(zonedDateTimeOther.hour));
			expect(minuteSegment).toHaveTextContent(String(zonedDateTimeOther.minute));
			expect(dayPeriodSegment).toHaveTextContent('PM');
			expect(timeZoneSegment).toHaveTextContent(String('EST'));
			expect(insideValue).toHaveTextContent(zonedDateTimeOther.toString());
		});

		test('locale changes segment positioning', async () => {
			const { getByTestId } = render(DateFieldTest, {
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
			const { queryByTestId } = render(DateFieldTest, {
				locale: 'en-UK',
				defaultValue: calendarDateTimeOther,
			});
			expect(queryByTestId('dayPeriod')).toBeNull();
		});

		test('certain locales do show day period segment', async () => {
			const { queryByTestId } = render(DateFieldTest, {
				defaultValue: calendarDateTimeOther,
			});
			expect(queryByTestId('dayPeriod')).not.toBeNull();
		});
	});

	describe('Navigation', () => {
		test('focuses first segment on click', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest);

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			expect(firstSegment).toHaveFocus();
		});

		test('increments segment on arrow up', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest, {
				defaultPlaceholderValue: calendarDateToday,
			});
			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(`{${kbd.ARROW_UP}}`);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(`{${kbd.ARROW_UP}}`);
			expect(firstSegment).toHaveTextContent(String(calendarDateToday.month + 1));
		});

		test('increments segment on arrow down', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest, {
				defaultPlaceholderValue: calendarDateToday,
			});

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(`{${kbd.ARROW_DOWN}}`);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			expect(firstSegment).toHaveTextContent(String(calendarDateToday.month - 1));
		});

		test('increments segment on arrow down', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest, {
				defaultPlaceholderValue: calendarDateToday,
			});

			const firstSegment = getByTestId('month');
			await user.click(firstSegment);

			await user.keyboard(`{${kbd.ARROW_DOWN}}`);

			const currentMonth = calendarDateToday.month;
			expect(firstSegment).toHaveTextContent(String(currentMonth));

			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			expect(firstSegment).toHaveTextContent(String(calendarDateToday.month - 1));
		});

		test('navigates segments using arrow keys', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest);

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');

			await user.click(monthSegment);
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
			expect(daySegment).toHaveFocus();

			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
			expect(yearSegment).toHaveFocus();

			await user.keyboard(`{${kbd.ARROW_LEFT}}`);
			expect(daySegment).toHaveFocus();

			await user.keyboard(`{${kbd.ARROW_LEFT}}`);
			expect(monthSegment).toHaveFocus();
		});

		test('navigates segments using tab', async () => {
			const user = userEvent.setup();
			const { getByTestId } = render(DateFieldTest);

			const monthSegment = getByTestId('month');
			const daySegment = getByTestId('day');
			const yearSegment = getByTestId('year');

			await user.click(monthSegment);
			await user.keyboard(`{${kbd.TAB}}`);
			expect(daySegment).toHaveFocus();

			await user.keyboard(`{${kbd.TAB}}`);
			expect(yearSegment).toHaveFocus();
		});
	});
});
