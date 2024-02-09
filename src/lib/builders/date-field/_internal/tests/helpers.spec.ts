import { describe, expect, it } from 'vitest';
import { initSegmentIds, initSegmentStates, initializeSegmentValues } from '../helpers.js';

describe('initializeSegmentValues', () => {
	it('should return the correct values for each granularity', () => {
		const valuesDay = initializeSegmentValues('day');
		expect(valuesDay).toEqual({
			day: null,
			month: null,
			year: null,
			dayPeriod: 'AM',
		});

		const dayTimeObj = {
			day: null,
			month: null,
			year: null,
			hour: null,
			minute: null,
			second: null,
			dayPeriod: 'AM',
		};

		const valuesHour = initializeSegmentValues('hour');
		expect(valuesHour).toEqual(dayTimeObj);

		const valuesMinute = initializeSegmentValues('minute');
		expect(valuesMinute).toEqual(dayTimeObj);

		const valuesSecond = initializeSegmentValues('second');
		expect(valuesSecond).toEqual(dayTimeObj);
	});
});

describe('initSegmentStates', () => {
	it('should initialize the segment states', () => {
		const states = initSegmentStates();
		const properties = ['day', 'month', 'year', 'hour', 'minute', 'second', 'dayPeriod'];
		const initState = {
			lastKeyZero: false,
			hasLeftFocus: true,
			hasTouched: false,
		};
		expect(states).toEqual(Object.fromEntries(properties.map((prop) => [prop, initState])));
	});
});

describe('initSegmentIds', () => {
	it('should initialize the segment ids', () => {
		const ids = initSegmentIds();
		const properties = ['day', 'month', 'year', 'hour', 'minute', 'second', 'dayPeriod'];

		properties.forEach((prop) => {
			expect(ids).toHaveProperty(prop);
		});
	});
});
