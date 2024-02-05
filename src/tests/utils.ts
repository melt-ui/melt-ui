import { kbd } from '$lib/internal/helpers/index.js';

type KbdKeys = keyof typeof kbd;
/**
 * A wrapper around the internal kbd object to make it easier to use
 * in tests which require the key names to be wrapped in curly braces.
 */
export const testKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce((acc, [key, value]) => {
	acc[key as KbdKeys] = `{${value}}`;
	return acc;
}, {} as Record<KbdKeys, string>);

export function removeUndefined<T extends object>(obj: T): T {
	const result = {} as T;
	for (const key in obj) {
		const value = obj[key];
		if (value !== undefined) {
			result[key] = value;
		}
	}
	return result;
}

export function exists(get: (id: string) => HTMLElement, testId: string) {
	try {
		get(testId);
		return true;
	} catch {
		return false;
	}
}
