import type { ValueOf } from '$lib/internal/types.js';
import { dequal } from 'dequal';

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
	[K in keyof T]: T[K] extends ToStrip ? never : K;
};

type StripValues<T extends Record<string, unknown>, ToStrip> = {
	[K in StrippedKeys<T, ToStrip>[keyof T]]: T[K];
};

export function stripValues<T extends Record<string, unknown>, ToStrip>(inputObject: T, toStrip: ToStrip) {
	return Object.fromEntries(
		Object.entries(inputObject).filter(([_, value]) => !dequal(value, toStrip))
	) as StripValues<T, ToStrip>;
}
