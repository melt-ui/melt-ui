import { describe, expect, it } from 'vitest';
import { omit, deepEqual } from '../object.js';

describe('omit', () => {
	it('omits keys from a given object', () => {
		expect(
			omit({ sweet: ['Caramel', 'Chocolate'], savory: ['Basil', 'Bacon'] }, 'sweet')
		).toStrictEqual({ savory: ['Basil', 'Bacon'] });
	});
});

const deepEqualCases: Array<[unknown, unknown, boolean]> = [
	[undefined, undefined, true],
	[null, null, true],
	[false, false, true],
	[true, true, true],
	[0, 0, true],
	[0, 1, false],
	[1, 1, true],
	[1, 2, false],
	['', '', true],
	['', 'a', false],
	['a', 'a', true],
	['a', 'b', false],
	[[], [], true],
	[[], [1], false],
	[[1], [1], true],
	[[1], [2], false],
	[{}, {}, true],
	[{}, { a: 1 }, false],
	[{ a: 1 }, { a: 1 }, true],
	[{ a: 1 }, { a: 2 }, false],
	[{ a: 1 }, { b: 1 }, false],
	[{ a: 1 }, { a: 1, b: 1 }, false],
	[{ a: 1, b: 1 }, { a: 1 }, false],
	[{ a: 1, b: 1 }, { a: 1, b: 1 }, true],
	[{ a: 1, b: 1 }, { a: 1, b: 2 }, false],
	[{ a: 1, b: 1 }, { a: 1, c: 1 }, false],
	[{ a: 1, b: 1 }, { a: 1, b: 1, c: 1 }, false],
	[{ a: 1, b: 1, c: 1 }, { a: 1, b: 1 }, false],
	[{ a: 1, b: 1, c: 1 }, { a: 1, b: 1, c: 1 }, true],
	[{ a: 1, b: 1, c: 1 }, { a: 1, b: 1, c: 2 }, false],
	[{ a: 1, b: 1, c: 1 }, { a: 1, b: 1, d: 1 }, false],
	[{ a: 1, b: 1, c: { d: 1 } }, { a: 1, b: 1, c: { d: 1 } }, true],
	[{ a: 1, b: 1, c: { d: 1 } }, { a: 1, b: 1, c: { d: 2 } }, false],
];

describe('deepEqual', () => {
	for (const [a, b, expected] of deepEqualCases) {
		it(`deepEqual(${JSON.stringify(a)}, ${JSON.stringify(b)}) === ${expected}`, () => {
			expect(deepEqual(a, b)).toBe(expected);
		});
	}
});
