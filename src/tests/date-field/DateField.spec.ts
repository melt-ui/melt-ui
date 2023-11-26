import { testKbd as kbd } from '../utils.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DateFieldTest from './DateFieldTest.svelte';
import {
	CalendarDate,
	CalendarDateTime,
	now,
	parseAbsoluteToLocal,
	toZoned,
} from '@internationalized/date';
import type { CreateDateFieldProps } from '$lib';

const calendarDateOther = new CalendarDate(1980, 1, 20);
const calendarDateTimeOther = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTimeOther = toZoned(calendarDateTimeOther, 'America/New_York');

function setup(props: CreateDateFieldProps = {}) {
	const user = userEvent.setup();
	const returned = render(DateFieldTest, props);
	return {
		...returned,
		user,
	};
}

describe('DateField', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(DateFieldTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});

	test('segments populated with defaultValue - CalendarDate', async () => {
		const { getByTestId } = setup({
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
		const { getByTestId } = setup({
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
		const { getByTestId } = setup({
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
			defaultValue: calendarDateTimeOther,
		});
		expect(queryByTestId('dayPeriod')).toBeNull();
	});

	test('certain locales do show day period segment', async () => {
		const { queryByTestId } = setup({
			defaultValue: calendarDateTimeOther,
		});
		expect(queryByTestId('dayPeriod')).not.toBeNull();
	});
	test('focuses first segment on click', async () => {
		const { getByTestId, user } = setup();

		const firstSegment = getByTestId('month');
		await user.click(firstSegment);

		expect(firstSegment).toHaveFocus();
	});

	test('increments segment on arrow up', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDateOther,
		});
		const firstSegment = getByTestId('month');
		await user.click(firstSegment);

		await user.keyboard(kbd.ARROW_UP);

		const currentMonth = calendarDateOther.month;
		expect(firstSegment).toHaveTextContent(String(currentMonth));

		await user.keyboard(kbd.ARROW_UP);
		expect(firstSegment).toHaveTextContent(String(calendarDateOther.month + 1));
	});

	test('increments segment on arrow down', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDateOther,
		});

		const firstSegment = getByTestId('month');
		await user.click(firstSegment);

		await user.keyboard(kbd.ARROW_DOWN);

		const currentMonth = calendarDateOther.month;
		expect(firstSegment).toHaveTextContent(String(currentMonth));

		await user.keyboard(kbd.ARROW_DOWN);
		expect(firstSegment).toHaveTextContent(String(12));
	});

	test('increments segment on arrow down', async () => {
		const { getByTestId, user } = setup({
			defaultPlaceholder: calendarDateOther,
		});

		const firstSegment = getByTestId('month');
		await user.click(firstSegment);

		await user.keyboard(kbd.ARROW_DOWN);

		const currentMonth = calendarDateOther.month;
		expect(firstSegment).toHaveTextContent(String(currentMonth));

		await user.keyboard(kbd.ARROW_DOWN);
		expect(firstSegment).toHaveTextContent(String(12));
	});

	test('navigates segments using arrow keys', async () => {
		const { getByTestId, user } = setup();

		const monthSegment = getByTestId('month');
		const daySegment = getByTestId('day');
		const yearSegment = getByTestId('year');

		await user.click(monthSegment);
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(daySegment).toHaveFocus();

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(yearSegment).toHaveFocus();

		await user.keyboard(kbd.ARROW_LEFT);
		expect(daySegment).toHaveFocus();

		await user.keyboard(kbd.ARROW_LEFT);
		expect(monthSegment).toHaveFocus();
	});

	test('navigates segments using tab', async () => {
		const { getByTestId, user } = setup();

		const monthSegment = getByTestId('month');
		const daySegment = getByTestId('day');
		const yearSegment = getByTestId('year');

		await user.click(monthSegment);
		await user.keyboard(kbd.TAB);
		expect(daySegment).toHaveFocus();

		await user.keyboard(kbd.TAB);
		expect(yearSegment).toHaveFocus();
	});

	test('disabled prop prevents interaction', async () => {
		const { getByTestId, user } = setup({
			disabled: true,
		});
		const monthSegment = getByTestId('month');
		const daySegment = getByTestId('day');
		const yearSegment = getByTestId('year');

		await user.click(monthSegment);
		expect(monthSegment).not.toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(daySegment).not.toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(yearSegment).not.toHaveFocus();

		await user.click(daySegment);
		expect(daySegment).not.toHaveFocus();
		await user.click(yearSegment);
		expect(yearSegment).not.toHaveFocus();
	});

	test('readonly prop prevents modifying segments', async () => {
		const { getByTestId, user } = setup({
			readonly: true,
			defaultValue: calendarDateOther,
		});
		const segments = ['month', 'day', 'year'] as const;

		for (const segment of segments) {
			const el = getByTestId(segment);
			expect(el).toHaveTextContent(String(calendarDateOther[segment]));
			await user.click(el);
			expect(el).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(el).toHaveTextContent(String(calendarDateOther[segment]));
		}
	});

	test('if selected date unavailable, mark field as invalid', async () => {
		const { getByTestId, user } = setup({
			granularity: 'day',
			isDateUnavailable: (date) => {
				return date.day === 20;
			},
		});
		const daySegment = getByTestId('day');
		const monthSegment = getByTestId('month');
		const yearSegment = getByTestId('year');

		await user.click(monthSegment);
		await user.keyboard(`{2}`);
		expect(monthSegment).toHaveTextContent('2');
		expect(daySegment).toHaveFocus();
		await user.keyboard(`{20}`);
		expect(daySegment).toHaveTextContent('20');
		expect(yearSegment).toHaveFocus();
		await user.keyboard(`{1111}`);
		expect(yearSegment).toHaveTextContent('1111');

		const segments = [daySegment, monthSegment, yearSegment];

		for (const segment of segments) {
			expect(segment).toHaveAttribute('data-invalid');
			expect(segment).toHaveAttribute('aria-invalid');
		}

		expect(getByTestId('field')).toHaveAttribute('data-invalid', '');
	});

	test('hourcycle prop changes the hour cycle', async () => {
		const { getByTestId, queryByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			hourCycle: 24,
		});
		expect(queryByTestId('dayPeriod')).toBeNull();

		const hourSegment = getByTestId('hour');

		expect(hourSegment).toHaveTextContent('12');
		await user.click(hourSegment);
		expect(hourSegment).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(hourSegment).toHaveTextContent('13');
	});

	test('day granularity overrides default displayed segments', async () => {
		const { getByTestId, queryByTestId } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'day',
		});

		const monthSegment = getByTestId('month');
		const daySegment = getByTestId('day');
		const yearSegment = getByTestId('year');

		const nonDisplayedSegments = ['hour', 'minute', 'second', 'dayPeriod'];

		for (const segment of nonDisplayedSegments) {
			expect(queryByTestId(segment)).toBeNull();
		}

		for (const segment of [monthSegment, daySegment, yearSegment]) {
			expect(segment).toBeVisible();
		}
	});

	test('minute granularity overrides default displayed segments', async () => {
		const { queryByTestId } = setup({
			defaultValue: calendarDateOther,
			granularity: 'minute',
		});

		const segments = ['month', 'day', 'year', 'hour', 'minute', 'dayPeriod'];
		const nonDisplayedSegments = ['second'];

		for (const segment of nonDisplayedSegments) {
			expect(queryByTestId(segment)).toBeNull();
		}

		for (const segment of segments) {
			expect(queryByTestId(segment)).not.toBeNull();
		}
	});

	test('changing the dayperiod segment changes the value', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
		});

		const dayPeriodSegment = getByTestId('dayPeriod');
		const insideValue = getByTestId('inside-value');

		expect(dayPeriodSegment).toHaveTextContent('PM');

		await user.click(dayPeriodSegment);
		expect(dayPeriodSegment).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(dayPeriodSegment).toHaveTextContent('AM');
		expect(insideValue).toHaveTextContent('1980-01-20T00:30');
	});

	test('spamming 3 takes you all the way through the segment', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'minute',
		});

		const monthSegment = getByTestId('month');
		const daySegment = getByTestId('day');
		const yearSegment = getByTestId('year');
		const hourSegment = getByTestId('hour');
		const minuteSegment = getByTestId('minute');

		await user.click(monthSegment);
		expect(monthSegment).toHaveFocus();
		await user.keyboard(`{3}`);
		expect(daySegment).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(yearSegment).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(hourSegment).toHaveFocus();
		await user.keyboard(`{3}`);
		expect(minuteSegment).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);

		expect(monthSegment).toHaveTextContent('3');
		expect(daySegment).toHaveTextContent('3');
		expect(yearSegment).toHaveTextContent('3333');
		expect(hourSegment).toHaveTextContent('3');
		expect(minuteSegment).toHaveTextContent('33');
	});

	test('fully overwrite on first click and type - month', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'second',
		});

		const monthSegment = getByTestId('month');
		await user.click(monthSegment);
		expect(monthSegment).toHaveFocus();
		expect(monthSegment).toHaveTextContent('1');
		await user.keyboard(`{3}`);
		expect(monthSegment).toHaveTextContent('3');
	});

	test('fully overwrite on first click and type - day', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'second',
		});

		const daySegment = getByTestId('day');
		await user.click(daySegment);
		expect(daySegment).toHaveFocus();
		expect(daySegment).toHaveTextContent('20');
		await user.keyboard(`{1}`);
		expect(daySegment).toHaveTextContent('1');
	});

	test('fully overwrite on first click and type - year', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'second',
		});

		const yearSegment = getByTestId('year');
		await user.click(yearSegment);
		expect(yearSegment).toHaveFocus();
		expect(yearSegment).toHaveTextContent('1980');
		await user.keyboard(`{1}`);
		expect(yearSegment).toHaveTextContent('1');
	});

	test('fully overwrite on first click and type - hour', async () => {
		const { getByTestId, user } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'second',
		});

		const hourSegment = getByTestId('hour');
		await user.click(hourSegment);
		expect(hourSegment).toHaveFocus();
		expect(hourSegment).toHaveTextContent('12');
		await user.keyboard(`{1}`);
		expect(hourSegment).toHaveTextContent('1');
	});

	test('fully overwrite on first click and type - minute', async () => {
		const user = userEvent.setup();
		const { getByTestId } = setup({
			defaultValue: calendarDateTimeOther,
			granularity: 'second',
		});

		const minuteSegment = getByTestId('minute');
		await user.click(minuteSegment);
		expect(minuteSegment).toHaveFocus();
		expect(minuteSegment).toHaveTextContent('30');
		await user.keyboard(`{1}`);
		expect(minuteSegment).toHaveTextContent('1');
	});

	test('displays correct timezone with ZonedDateTime value - now', async () => {
		const { getByTestId } = setup({
			defaultValue: now('America/Los_Angeles'),
		});

		const timeZoneSegment = getByTestId('timeZoneName');
		if (isDaylightSavingsTime()) {
			expect(timeZoneSegment).toHaveTextContent('PDT');
		} else {
			expect(timeZoneSegment).toHaveTextContent('PST');
		}
	});

	test('displays correct timezone with ZonedDateTime value - absolute to local', async () => {
		const { getByTestId } = setup({
			defaultValue: parseAbsoluteToLocal('2023-10-12T12:30:00Z'),
		});

		const timeZoneSegment = getByTestId('timeZoneName');

		expect(timeZoneSegment).toHaveTextContent(thisTimeZone('2023-10-12T12:30:00Z'));
	});
});

function isDaylightSavingsTime(): boolean {
	const now = new Date();
	const january = new Date(now.getFullYear(), 0, 1);
	const july = new Date(now.getFullYear(), 6, 1);
	const timezoneOffset = now.getTimezoneOffset();
	const isDaylightSavingsTime =
		timezoneOffset < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	return isDaylightSavingsTime;
}

function thisTimeZone(date: string): string {
	const timezone =
		Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
			.formatToParts(new Date(date))
			.find((p) => p.type === 'timeZoneName')?.value ?? '';
	return timezone;
}
