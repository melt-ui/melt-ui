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

export function removeUndefinedValues(inputObject: { [key: string]: any }): { [key: string]: any } {
	return Object.fromEntries(
		Object.entries(inputObject)
			.filter(([key, value]) => value !== undefined)
			.map(([key, value]) => [key, value === Object(value) ? removeUndefinedValues(value) : value])
	);
}
