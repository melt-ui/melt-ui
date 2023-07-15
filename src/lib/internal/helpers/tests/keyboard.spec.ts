import { describe, expect, test } from 'vitest';
import { kbd, getNextKey, getPrevKey, getDirectionalKeys } from '../keyboard';

describe('getNextKey', () => {
	test.each([
		{ expected: kbd.ARROW_RIGHT },
		{ dir: 'rtl', expected: kbd.ARROW_LEFT },
		{ orientation: 'vertical', expected: kbd.ARROW_DOWN },
		{ dir: 'rtl', orientation: 'vertical', expected: kbd.ARROW_DOWN },
	] as const)('getNextKey($dir, $orientation) -> $expected', ({ dir, orientation, expected }) => {
		expect(getNextKey(dir, orientation)).toBe(expected);
	});
});

describe('getPrevKey', () => {
	test.each([
		{ expected: kbd.ARROW_LEFT },
		{ dir: 'rtl', expected: kbd.ARROW_RIGHT },
		{ orientation: 'vertical', expected: kbd.ARROW_UP },
		{ dir: 'rtl', orientation: 'vertical', expected: kbd.ARROW_UP },
	] as const)('getPrevKey($dir, $orientation) -> $expected', ({ dir, orientation, expected }) => {
		expect(getPrevKey(dir, orientation)).toBe(expected);
	});
});

describe('getDirectionalKeys', () => {
	test.each([
		{
			expected: { nextKey: kbd.ARROW_RIGHT, prevKey: kbd.ARROW_LEFT },
		},
		{
			dir: 'rtl',
			expected: { nextKey: kbd.ARROW_LEFT, prevKey: kbd.ARROW_RIGHT },
		},
		{
			orientation: 'vertical',
			expected: { nextKey: kbd.ARROW_DOWN, prevKey: kbd.ARROW_UP },
		},
	] as const)(
		'getDirectionalKeys($dir, $orientation) -> $expected',
		({ dir, orientation, expected }) => {
			expect(getDirectionalKeys(dir, orientation)).toStrictEqual(expected);
		}
	);
});
