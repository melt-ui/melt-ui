import { describe, expect, test } from 'vitest';
import { last, next, prev, wrapArray } from '../array';

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
		// Happy path: finding the next item.
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
		// Happy path: finding the previous item.
		{ array: ['a', 'b', 'c'], index: 1, loop: false, expected: 'a' },
		// Looping behavior.
		{ array: ['a', 'b', 'c'], index: 0, loop: false, expected: 'a' },
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
		expect(wrapArray(array, startIndex)).toEqual(expected);
	});
});
