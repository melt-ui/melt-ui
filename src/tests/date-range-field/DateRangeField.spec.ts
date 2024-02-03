import { testKbd as kbd } from '../utils.js';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DateRangeFieldTest from './DateRangeFieldTest.svelte';
import { CalendarDate, CalendarDateTime, toZoned } from '@internationalized/date';
import type { CreateDateRangeFieldProps } from '$lib/index.js';

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

function setup(props: CreateDateRangeFieldProps = {}) {
	const user = userEvent.setup();
	const returned = render(DateRangeFieldTest, props);
	return {
		...returned,
		user,
	};
}

describe('DateField', () => {
	describe('Accessibility', () => {
		test('has no accessibility violations', async () => {
			const { container } = render(DateRangeFieldTest);

			expect(await axe(container)).toHaveNoViolations();
		});
	});

	test('segments populated with defaultValue - CalendarDate', async () => {
		const { getByTestId } = setup({
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
		const { getByTestId } = setup({
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
		const { getByTestId } = setup({
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
		const { getByTestId, user } = setup({
			defaultValue: exampleDate,
		});

		const fields = ['start', 'end'] as const;
		const segments = ['month', 'day', 'year'] as const;

		await user.click(getByTestId('start-month'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'start' && segment === 'month') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.ARROW_RIGHT);
				expect(segmentEl).toHaveFocus();
			}
		}

		await user.click(getByTestId('start-month'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'start' && segment === 'month') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.TAB);
				expect(segmentEl).toHaveFocus();
			}
		}
	});
	test('navigation between fields - right to left', async () => {
		const { getByTestId, user } = setup({
			defaultValue: exampleDate,
		});

		const fields = ['end', 'start'] as const;
		const segments = ['year', 'day', 'month'] as const;

		await user.click(getByTestId('end-year'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'end' && segment === 'year') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.ARROW_LEFT);
				expect(segmentEl).toHaveFocus();
			}
		}

		await user.click(getByTestId('end-year'));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === 'end' && segment === 'year') continue;
				const segmentEl = getByTestId(`${field}-${segment}`);
				await user.keyboard(`{Shift>}${kbd.TAB}`);
				expect(segmentEl).toHaveFocus();
			}
		}
	});

	test('custom ids are applied when provided', async () => {
		const ids = {
			field: 'id-field',
			label: 'id-label',
			description: 'id-description',
			validation: 'id-validation',
		};

		const startIds = {
			day: 'id-day-start',
			month: 'id-month-start',
			dayPeriod: 'id-dayPeriod-start',
			hour: 'id-hour-start',
			minute: 'id-minute-start',
			year: 'id-year-start',
			timeZoneName: 'id-timeZoneName-start',
			second: 'id-second-start',
		};

		const endIds = {
			day: 'id-day-end',
			month: 'id-month-end',
			dayPeriod: 'id-dayPeriod-end',
			hour: 'id-hour-end',
			minute: 'id-minute-end',
			year: 'id-year-end',
			timeZoneName: 'id-timeZoneName-end',
			second: 'id-second-end',
		};

		const { getByTestId } = setup({
			defaultValue: exampleZonedDateTime,
			ids,
			startIds,
			endIds,
			granularity: 'second',
		});

		const field = getByTestId('field');
		const label = getByTestId('label');
		const validation = getByTestId('validation');

		const segments = [
			'month',
			'day',
			'year',
			'hour',
			'second',
			'minute',
			'dayPeriod',
			'timeZoneName',
		] as const;
		const fields = ['start', 'end'] as const;

		for (const field of fields) {
			for (const segment of segments) {
				const segmentEl = getByTestId(`${field}-${segment}`);
				if (field === 'start') {
					expect(segmentEl.id).toBe(startIds[segment]);
				} else {
					expect(segmentEl.id).toBe(endIds[segment]);
				}
			}
		}

		const descriptionEl = document.getElementById(ids.description);
		expect(descriptionEl).toBeInTheDocument();

		expect(field.id).toBe(ids.field);
		expect(label.id).toBe(ids.label);
		expect(validation.id).toBe(ids.validation);

		expect(field.getAttribute('aria-describedby')).toBe(ids.description);
	});

	test('clicking the label focuses the first segment', async () => {
		const { getByTestId, user } = setup();
		const label = getByTestId('label');
		const monthSegment = getByTestId('start-month');
		await user.click(label);
		expect(monthSegment).toHaveFocus();
	});

	test('overridable store functions as expected', async () => {
		const overrideDay = {
			start: new CalendarDate(1980, 2, 25),
			end: new CalendarDate(1980, 2, 26),
		};

		const { getByTestId, user } = setup({
			defaultValue: exampleDate,
			onValueChange: () => {
				return overrideDay;
			},
		});

		const startDay = getByTestId('start-day');

		expect(getByTestId('start-value')).toHaveTextContent(exampleDate.start.toString());
		expect(getByTestId('end-value')).toHaveTextContent(exampleDate.end.toString());

		await user.click(startDay);
		await user.keyboard(kbd.ARROW_DOWN);

		expect(getByTestId('start-value')).toHaveTextContent(overrideDay.start.toString());
		expect(getByTestId('end-value')).toHaveTextContent(overrideDay.end.toString());
	});

	test('readonlySegments prop prevents modifying given segments', async () => {
		const { getByTestId, user } = setup({
			defaultValue: exampleDate,
			readonlySegments: {
				start: ['month'],
				end: ['month', 'year'],
			},
		});

		// start field
		{
			// start month should not change
			const monthSegment = getByTestId('start-month');
			expect(monthSegment).toHaveTextContent(String(exampleDate.start['month']));
			await user.click(monthSegment);
			expect(monthSegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(monthSegment).toHaveTextContent(String(exampleDate.start['month']));

			// start day should change
			const daySegment = getByTestId('start-day');
			expect(daySegment).toHaveTextContent(String(exampleDate.start['day']));
			await user.click(daySegment);
			expect(daySegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(daySegment).toHaveTextContent(String(exampleDate.start['day'] + 1));

			// start year should change
			const yearSegment = getByTestId('start-year');
			expect(yearSegment).toHaveTextContent(String(exampleDate.start['year']));
			await user.click(yearSegment);
			expect(yearSegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(yearSegment).toHaveTextContent(String(exampleDate.start['year'] + 1));
		}

		// end field
		{
			// end month should not change
			const monthSegment = getByTestId('end-month');
			expect(monthSegment).toHaveTextContent(String(exampleDate.end['month']));
			await user.click(monthSegment);
			expect(monthSegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(monthSegment).toHaveTextContent(String(exampleDate.end['month']));

			// end day should change
			const daySegment = getByTestId('end-day');
			expect(daySegment).toHaveTextContent(String(exampleDate.end['day']));
			await user.click(daySegment);
			expect(daySegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(daySegment).toHaveTextContent(String(exampleDate.end['day'] + 1));

			// end year should not change
			const yearSegment = getByTestId('end-year');
			expect(yearSegment).toHaveTextContent(String(exampleDate.end['year']));
			await user.click(yearSegment);
			expect(yearSegment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(yearSegment).toHaveTextContent(String(exampleDate.end['year']));
		}
	});
});
