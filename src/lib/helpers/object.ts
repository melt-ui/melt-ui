import type { ValueOf } from '$lib/types';

export function omit<T extends Record<string, PropertyKey>, K extends keyof T>(
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
