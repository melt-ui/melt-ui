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

type StripValuesRecursive<T extends Record<string, unknown>, ToStrip> = {
	[K in StrippedKeys<T, ToStrip>[keyof T]]: T[K] extends Record<string, unknown>
		? StripValuesRecursive<T[K], ToStrip>
		: T[K];
};

export function stripValues<T extends Record<string, unknown>, ToStrip>(
	inputObject: T,
	toStrip: ToStrip,
	recursive: false
): StripValues<T, ToStrip>;
export function stripValues<T extends Record<string, unknown>, ToStrip>(
	inputObject: T,
	toStrip: ToStrip,
	recursive: true
): StripValuesRecursive<T, ToStrip>;
export function stripValues<T extends Record<string, unknown>, ToStrip>(
	inputObject: T,
	toStrip: ToStrip,
	recursive: boolean
) {
	return Object.fromEntries(
		Object.entries(inputObject).filter(([_, value]) => !dequal(value, toStrip))
	) as typeof recursive extends true ? StripValuesRecursive<T, ToStrip> : StripValues<T, ToStrip>;
}

export function removeUndefined<T extends object>(
	obj: T
): {
	[K in keyof T]-?: Exclude<T[K], undefined>;
} {
	const result = {} as { [K in keyof T]-?: Exclude<T[K], undefined> };
	for (const key in obj) {
		const value = obj[key];
		if (value !== undefined) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			result[key] = value as any;
		}
	}
	return result;
}

/**
 * Strict typed `Object.keys`
 *
 * @category Object
 */
export function objectKeys<T extends object>(obj: T) {
	return Object.keys(obj) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>;
}

/**
 * Strict typed `Object.entries`
 *
 * @category Object
 */
export function objectEntries<T extends object>(obj: T) {
	return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}
