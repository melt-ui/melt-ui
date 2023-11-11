import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DateRangeFieldTest from './DateRangeFieldTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned } from '@internationalized/date';

const exampleDate = {
	start: new CalendarDate(2022, 1, 1),
	end: new CalendarDate(2022, 3, 1),
};

const exampleDateTime = {
	start: new CalendarDateTime(2022, 1, 1, 12, 30),
	end: new CalendarDateTime(2022, 3, 1, 12, 30),
};

const exampleZonedDateTime = {
	start: toZoned(exampleDateTime.start, 'America/New_York'),
	end: toZoned(exampleDateTime.end, 'America/New_York'),
};

describe('DateField', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(DateRangeFieldTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});

	test('segments populated with defaultValue - CalendarDate', async () => {
		const { getByTestId } = render(DateRangeFieldTest, {
			defaultValue: exampleDate,
		});

		const fields = ['start', 'end'] as const;
		const segments = ['month', 'day', 'year'] as const;

		fields.forEach((field) => {
			segments.forEach((segment) => {
				const segmentEl = getByTestId(`${field}-${segment}`);
				expect(segmentEl).toHaveTextContent(String(exampleDate[field][segment]));
			});
		});
	});
	test('segments populated with defaultValue - CalendarDateTime', async () => {
		const { getByTestId } = render(DateRangeFieldTest, {
			defaultValue: exampleDateTime,
		});

		const fields = ['start', 'end'] as const;
		const segments = ['month', 'day', 'year', 'hour', 'minute'] as const;

		fields.forEach((field) => {
			segments.forEach((segment) => {
				const segmentEl = getByTestId(`${field}-${segment}`);
				expect(segmentEl).toHaveTextContent(String(exampleDateTime[field][segment]));
			});
		});

		expect(getByTestId('start-dayPeriod')).toHaveTextContent('PM');
	});

	test('segments populated with defaultValue - ZonedDateTime', async () => {
		const { getByTestId } = render(DateRangeFieldTest, {
			defaultValue: exampleZonedDateTime,
		});

		const fields = ['start', 'end'] as const;
		const segments = ['month', 'day', 'year', 'hour', 'minute'] as const;

		fields.forEach((field) => {
			segments.forEach((segment) => {
				const segmentEl = getByTestId(`${field}-${segment}`);
				expect(segmentEl).toHaveTextContent(String(exampleDateTime[field][segment]));
			});
		});
		expect(getByTestId('start-dayPeriod')).toHaveTextContent('PM');
	});

	test('navigation between fields - left to right', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(DateRangeFieldTest, {
			defaultValue: exampleDate,
		});

		const fields = ['start', 'end'] as const;
		const segments = ['month', 'day', 'year'] as const;

		await userEvent.click(getByTestId('start-month'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'start' && segment === 'month') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
				expect(segmentEl).toHaveFocus();
			}
		}

		await userEvent.click(getByTestId('start-month'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'start' && segment === 'month') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(`{${kbd.TAB}}`);
				expect(segmentEl).toHaveFocus();
			}
		}
	});
	test('navigation between fields - right to left', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(DateRangeFieldTest, {
			defaultValue: exampleDate,
		});

		const fields = ['end', 'start'] as const;
		const segments = ['year', 'day', 'month'] as const;

		await userEvent.click(getByTestId('end-year'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'end' && segment === 'year') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(`{${kbd.ARROW_LEFT}}`);
				expect(segmentEl).toHaveFocus();
			}
		}

		await userEvent.click(getByTestId('end-year'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'end' && segment === 'year') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(`{Shift>}{${kbd.TAB}}`);
				expect(segmentEl).toHaveFocus();
			}
		}
	});
});
