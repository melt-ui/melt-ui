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

type StrippedKeys<T extends Record<string, unknown>, ToStrip> = {
  [K in keyof T]: T[K] extends ToStrip ? never : K
}

type StripValues<T extends Record<string, unknown>, ToStrip> = {
  [K in StrippedKeys<T, ToStrip>[keyof T]]: T[K]
}

export function removeUndefinedValues<T extends Record<string, unknown>>(inputObject: T) {
	return Object.fromEntries(
		Object.entries(inputObject)
			.filter(([key, value]) => value !== undefined)
			.map(([key, value]) => [key, value === Object(value) ? removeUndefinedValues(value) : value])
	) as StripValues<T, undefined>
}
