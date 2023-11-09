import { describe, expect, it } from 'vitest';
import { createFormatter } from '../formatter.js';
import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import { toDate } from '../utils.js';

describe('Formatter', () => {
	it('should initialize with the given locale', () => {
		const formatter = createFormatter('en-US');
		expect(formatter.getLocale()).toBe('en-US');
	});

	it('should update the locale', () => {
		const formatter = createFormatter('en-US');
		expect(formatter.getLocale()).toBe('en-US');
		formatter.setLocale('fr-FR');
		expect(formatter.getLocale()).toBe('fr-FR');
	});

	it('should allow custom formatting options', () => {
		const formatter = createFormatter('en-US');
		const date = new Date('2021-01-01T12:00:00.000Z');
		expect(formatter.custom(date, { dateStyle: 'long' })).toBe('January 1, 2021');
	});

	it('should properly format selected dates', () => {
		const formatter = createFormatter('en-US');
		const withoutTime = new CalendarDate(2021, 1, 1);
		expect(formatter.selectedDate(withoutTime)).toBe('January 1, 2021');

		const withTime = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
		const tz = thisTimeZone(withTime.toString());

		expect(formatter.selectedDate(withTime)).toBe('January 1, 2021 at 12:00:00 PM ' + tz);
	});

	it('should properly format full months and years', () => {
		const formatter = createFormatter('en-US');
		const date = new Date('2021-01-01T12:00:00.000Z');
		expect(formatter.fullMonthAndYear(date)).toBe('January 2021');
	});

	it('should properly format full months', () => {
		const formatter = createFormatter('en-US');
		const date = new Date('2021-01-01T12:00:00.000Z');
		expect(formatter.fullMonth(date)).toBe('January');
	});

	it('should properly format full years', () => {
		const formatter = createFormatter('en-US');
		const date = new Date('2021-01-01T12:00:00.000Z');
		expect(formatter.fullYear(date)).toBe('2021');
	});

	it('should properly format to parts', () => {
		const formatter = createFormatter('en-US');
		const noTime = new CalendarDate(2021, 1, 1);
		expect(formatter.toParts(noTime)).toEqual([
			{ type: 'month', value: '1' },
			{ type: 'literal', value: '/' },
			{ type: 'day', value: '1' },
			{ type: 'literal', value: '/' },
			{ type: 'year', value: '2021' },
		]);

		const withTime = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
		const opts: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		};

		expect(formatter.toParts(withTime, opts)).toEqual([
			{ type: 'month', value: '01' },
			{ type: 'literal', value: '/' },
			{ type: 'day', value: '01' },
			{ type: 'literal', value: '/' },
			{ type: 'year', value: '2021' },
			{ type: 'literal', value: ', ' },
			{ type: 'hour', value: '12' },
			{ type: 'literal', value: ':' },
			{ type: 'minute', value: '00' },
			{ type: 'literal', value: ':' },
			{ type: 'second', value: '00' },
			{ type: 'literal', value: ' ' },
			{ type: 'dayPeriod', value: 'PM' },
		]);
	});

	it('should properly format days of week', () => {
		const formatter = createFormatter('en-US');
		const date = new Date('2021-01-01T12:00:00.000Z');
		expect(formatter.dayOfWeek(date, 'narrow')).toBe('F');
		expect(formatter.dayOfWeek(date, 'short')).toBe('Fri');
		expect(formatter.dayOfWeek(date, 'long')).toBe('Friday');
	});

	it('should properly format day period', () => {
		const formatter = createFormatter('en-US');
		const pm = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
		expect(formatter.dayPeriod(toDate(pm))).toBe('PM');
		const am = new CalendarDateTime(2021, 1, 1, 0, 0, 0);
		expect(formatter.dayPeriod(toDate(am))).toBe('AM');
	});
});

function thisTimeZone(date: string): string {
	const timezone =
		Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
			.formatToParts(new Date(date))
			.find((p) => p.type === 'timeZoneName')?.value ?? '';
	return timezone;
}
