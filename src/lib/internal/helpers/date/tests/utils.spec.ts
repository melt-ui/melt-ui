import { describe, expect, it } from 'vitest';
import {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
	getLocalTimeZone,
	now,
	toZoned,
} from '@internationalized/date';
import { getDefaultDate, parseStringToDateValue } from '../utils.js';

describe('Date Utils', () => {
	describe('getDefaultDate', () => {
		it('should return a CalendarDate if no props', () => {
			expect(getDefaultDate()).instanceOf(CalendarDate);
		});

		it('should return the type of placeholder if no value', () => {
			const placeholder = new CalendarDate(2021, 1, 1);
			expect(getDefaultDate({ defaultPlaceholderValue: placeholder })).instanceOf(CalendarDate);
			const placeholder2 = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
			expect(getDefaultDate({ defaultPlaceholderValue: placeholder2 })).instanceOf(
				CalendarDateTime
			);

			const placeholder3 = toZoned(placeholder2, 'America/New_York');
			expect(getDefaultDate({ defaultPlaceholderValue: placeholder3 })).instanceOf(ZonedDateTime);
		});

		it('should adjust the return type based on granularity with no values', () => {
			expect(getDefaultDate({ granularity: 'hour' })).instanceOf(CalendarDateTime);
			expect(getDefaultDate({ granularity: 'minute' })).instanceOf(CalendarDateTime);
			expect(getDefaultDate({ granularity: 'second' })).instanceOf(CalendarDateTime);
			expect(getDefaultDate({ granularity: 'day' })).instanceOf(CalendarDate);
		});

		it('should give precedence to defaultValue over defaultPlaceholderValue', () => {
			const placeholder = new CalendarDate(2021, 1, 1);
			const value = new CalendarDate(2020, 1, 1);
			expect(getDefaultDate({ defaultValue: value, defaultPlaceholderValue: placeholder })).toBe(
				value
			);
		});

		it('should not change type if provided based on granularity', () => {
			const placeholder = new CalendarDate(2021, 1, 1);
			const dd = getDefaultDate({ defaultPlaceholderValue: placeholder, granularity: 'hour' });
			expect(dd).not.instanceof(CalendarDateTime);
			expect(dd).instanceof(CalendarDate);

			const value = new CalendarDate(2022, 1, 1);
			const ddv = getDefaultDate({ defaultValue: value, granularity: 'hour' });
			expect(ddv).not.instanceof(CalendarDateTime);
			expect(ddv).instanceof(CalendarDate);

			const placeholder2 = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
			const dd2 = getDefaultDate({ defaultPlaceholderValue: placeholder2, granularity: 'day' });
			expect(dd2).not.instanceof(CalendarDate);
			expect(dd2).instanceof(CalendarDateTime);

			const value2 = new CalendarDateTime(2022, 1, 1, 12, 0, 0);
			const ddv2 = getDefaultDate({ defaultValue: value2, granularity: 'day' });
			expect(ddv2).not.instanceof(CalendarDate);
			expect(ddv2).instanceof(CalendarDateTime);
		});
	});
	describe('parseStringToDateValue', () => {
		it('should parse calendar date strings', () => {
			const cd = new CalendarDate(2021, 1, 1);
			const cdStr = cd.toString();
			expect(parseStringToDateValue(cdStr, cd)).toEqual(cd);
		});
		it('should parse calendar date time strings', () => {
			const cdt = new CalendarDateTime(2021, 1, 1, 12, 0, 0);
			const cdtStr = cdt.toString();
			expect(parseStringToDateValue(cdtStr, cdt)).toEqual(cdt);
		});
		it('should parse zoned date time strings', () => {
			const zdt = now(getLocalTimeZone());
			const zdtStr = zdt.toString();
			expect(parseStringToDateValue(zdtStr, zdt)).toEqual(zdt);
		});
	});
});
