import { describe, expect, it } from 'vitest';
import { createMonths } from '../calendar.js';
import { CalendarDate } from '@internationalized/date';

const calendarDate = new CalendarDate(2024, 1, 1);

describe('Calendar', () => {
	it('should create a month with the given locale, no fixed weeks and week starting on 0', () => {
		const month = createMonths({
			dateObj: calendarDate,
			weekStartsOn: 0,
			fixedWeeks: false,
			locale: 'en-US',
			numberOfMonths: 1,
		});
		expect(month[0].value.toString()).toBe(calendarDate.toString());
	});

	it('should create a month not containing duplicate dates when fixed weeks is true', () => {
		const month = createMonths({
			dateObj: calendarDate,
			weekStartsOn: 0,
			fixedWeeks: true,
			locale: 'en-US',
			numberOfMonths: 1,
		});
		const dateStringArray = month[0].dates.map((date) => date.toString());
		const dateStringSet = new Set(dateStringArray);
		expect(dateStringArray.length).toBe(dateStringSet.size);
	});
});
