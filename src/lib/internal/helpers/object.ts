import type { ValueOf } from '$lib/internal/types.js';

export function omit<T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: K[]
): Omit<T, K> {
	const result = {} as Omit<T, K>;
	for (const key of Object.keys(obj)) {
		if (!keys.includes(key as unknown as K)) {
			result[key as keyof Omit<T, K>] = obj[key] as ValueOf<Omit<T, K>>;
		}
	}
	return result;
}

function isRegExp(value: unknown): value is RegExp {
	return value instanceof RegExp;
}

/**
 * The fastest deep equal with ES6 Map, Set and Typed arrays support.
 * Adapted from the `fast-deep-equal` npm package.
 *
 * @see https://github.com/epoberezkin/fast-deep-equal#readme
 */
export function deepEqual(a: unknown, b: unknown) {
	if (a === b) return true;

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		if (a.constructor !== b.constructor) return false;

		let length, i;

		if (Array.isArray(a)) {
			length = a.length;
			if (!Array.isArray(b) || length != b.length) return false;
			for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}

		if (isRegExp(a)) return isRegExp(b) && a.source === b.source && a.flags === b.flags;
		if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
		if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

		const keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;

		for (i = length; i-- !== 0; )
			if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

		for (i = length; i-- !== 0; ) {
			const key = keys[i];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (!deepEqual((a as any)[key], (b as any)[key])) return false;
		}

		return true;
	}

	// true if both NaN, false otherwise
	return a !== a && b !== b;
}
