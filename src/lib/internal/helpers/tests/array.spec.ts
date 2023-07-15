import { describe, expect, test } from 'vitest';
import { back, forward, last, next, prev, wrapArray } from '../array';

describe('back', () => {
	test.each([
		// No elements.
		{ array: [], index: 0, increment: 1, loop: true, expected: undefined },
		// Happy path: finding the next element.
		{ array: ['a', 'b', 'c', 'd'], index: 3, increment: 2, loop: false, expected: 'b' },
		// With looping disabled, the last element should be returned.
		{ array: ['a', 'b', 'c', 'd'], index: 2, increment: 5, loop: false, expected: 'a' },
		// With looping enabled, the first element should be returned.
		{ array: ['a', 'b', 'c', 'd'], index: 0, increment: 5, loop: true, expected: 'd' },
	])(
		'back($array, $index, $increment, $loop) -> $expected',
		({ array, index, increment, loop, expected }) => {
			expect(back(array, index, increment, loop)).toBe(expected);
		}
	);
});

describe('forward', () => {
	test.each([
		// No elements.
		{ array: [], index: 0, increment: 1, loop: true, expected: undefined },
		// Happy path: finding the next element.
		{ array: ['a', 'b', 'c', 'd'], index: 0, increment: 2, loop: false, expected: 'c' },
		// With looping disabled, the last element should be returned.
		{ array: ['a', 'b', 'c', 'd'], index: 0, increment: 5, loop: false, expected: 'd' },
		// With looping enabled, the first element should be returned.
		{ array: ['a', 'b', 'c', 'd'], index: 0, increment: 5, loop: true, expected: 'a' },
	])(
		'forward($array, $index, $increment, $loop) -> $expected',
		({ array, index, increment, loop, expected }) => {
			expect(forward(array, index, increment, loop)).toBe(expected);
		}
	);
});

describe('last', () => {
	test.each([
		{ array: [], expected: undefined },
		{ array: ['a', 'b', 'c'], expected: 'c' },
	])('last($array) -> $expected', ({ array, expected }) => {
		expect(last(array)).toBe(expected);
	});
});

describe('next', () => {
	test.each([
		// Out of bounds.
		{ array: [], index: 0, loop: true, expected: undefined },
		{ array: ['a', 'b', 'c'], index: 4, loop: true, expected: undefined },
		// Happy path: finding the next element.
		{ array: ['a', 'b', 'c'], index: 0, loop: false, expected: 'b' },
		// Looping behavior.
		{ array: ['a', 'b', 'c'], index: 2, loop: false, expected: 'c' },
		{ array: ['a', 'b', 'c'], index: 2, loop: true, expected: 'a' },
	])('next($array, $index, $loop) -> $expected', ({ array, index, loop, expected }) => {
		expect(next(array, index, loop)).toBe(expected);
	});
});

describe('prev', () => {
	test.each([
		// Out of bounds.
		{ array: [], index: 0, loop: true, expected: undefined },
		{ array: ['a', 'b', 'c'], index: 4, loop: true, expected: undefined },
		// Returning the previous element.
		{ array: ['a', 'b', 'c'], index: 1, loop: false, expected: 'a' },
		// With looping disabled, the first element should be returned.
		{ array: ['a', 'b', 'c'], index: 0, loop: false, expected: 'a' },
		// With looping enabled, the last element should be returned.
		{ array: ['a', 'b', 'c'], index: 0, loop: true, expected: 'c' },
		{ array: ['a', 'b', 'c'], index: -1, loop: true, expected: 'c' },
	])('prev($array, $index, $loop) -> $expected', ({ array, index, loop, expected }) => {
		expect(prev(array, index, loop)).toBe(expected);
	});
});

describe('wrapArray', () => {
	test.each([
		{ array: [], startIndex: 0, expected: [] },
		{ array: ['a', 'b', 'c', 'd'], startIndex: 0, expected: ['a', 'b', 'c', 'd'] },
		{ array: ['a', 'b', 'c', 'd'], startIndex: 2, expected: ['c', 'd', 'a', 'b'] },
		{ array: ['a', 'b', 'c', 'd'], startIndex: 4, expected: ['a', 'b', 'c', 'd'] },
	])('wrapArray($array, $startIndex) -> $expected', ({ array, startIndex, expected }) => {
		expect(wrapArray(array, startIndex)).toStrictEqual(expected);
	});
});
