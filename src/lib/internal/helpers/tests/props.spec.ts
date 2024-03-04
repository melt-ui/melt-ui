import { describe } from 'vitest';
import { parseProps } from '../props.js';
import { isWritable, isReadable, isObject } from '../is.js';
import { readable, writable } from 'svelte/store';

describe('parseProps', () => {
	it('should convert static props to writable ones', () => {
		const props = {
			value: 'test',
			open: false,
		};

		const parsed = parseProps({ props, idParts: ['a', 'b', 'c'] });
		Object.entries(parsed).forEach(([key, prop]) => {
			if (key === 'ids') {
				expect(isObject(prop)).toBe(true);
				Object.values(prop).forEach((id) => {
					expect(isWritable(id)).toBe(true);
				});
			} else {
				expect(isWritable(prop)).toBe(true);
				expect(prop).toHaveProperty('get');
			}
		});
	});
	it('should add get methods to readable props', () => {
		const props = {
			value: readable('test'),
			open: writable(false),
		};

		const parsed = parseProps({ props });

		expect(isReadable(parsed.value)).toBe(true);
		expect(parsed.value).toHaveProperty('get');
		expect(parsed.value.get()).toBe('test');

		expect(isWritable(parsed.open)).toBe(true);
		expect(parsed.open).toHaveProperty('get');
		expect(parsed.open.get()).toBe(false);
	});
	it('setting should only modify writable props value', () => {
		const props = {
			value: readable('test'),
			open: writable(false),
		};

		const parsed = parseProps({ props });

		expect(parsed.value.get()).toBe('test');
		parsed.value.set('new value');
		expect(parsed.value.get()).toBe('test');

		expect(parsed.open.get()).toBe(false);
		parsed.open.set(true);
		expect(parsed.open.get()).toBe(true);
	});
	it('setting the original store should modify the parsed props value', () => {
		const props = {
			open: writable(false),
		};

		const parsed = parseProps({ props });

		expect(parsed.open.get()).toBe(false);
		props.open.set(true);
		expect(parsed.open.get()).toBe(true);
	});
	it('should use defaults when no props are provided', () => {
		const defaults = {
			value: 'test',
			open: false,
		};

		const props = { open: true };

		const parsed = parseProps({ props, defaults });

		expect(parsed.value.get()).toBe('test');
		expect(parsed.open.get()).toBe(true);
	});
	it('should generate ids when idParts are provided', () => {
		const props = {
			value: 'test',
			open: false,
		};

		const idParts = ['a', 'b', 'c'] as const;

		const parsed = parseProps({ props, idParts });
		Object.values(parsed.ids).forEach((id) => {
			expect(isWritable(id)).toBe(true);
		});
	});
	it('should generate ids when ids are provided', () => {
		const props = {
			value: 'test',
			open: false,
			ids: {
				a: 'a',
				b: 'b',
				c: 'c',
			},
		};

		const parsed = parseProps({ props });
		Object.values(parsed.ids).forEach((id) => {
			expect(isWritable(id)).toBe(true);
		});
	});
	it('should merge ids when both idParts and ids are provided', () => {
		const props = {
			value: 'test',
			open: false,
			ids: {
				a: 'a',
				b: 'b',
				c: 'c',
			},
		};

		const idParts = ['d', 'e', 'f'] as const;

		const parsed = parseProps({ props, idParts });
		Object.values(parsed.ids).forEach((id) => {
			expect(isWritable(id)).toBe(true);
		});
	});
});
