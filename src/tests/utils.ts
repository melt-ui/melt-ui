import { kbd, removeUndefined } from '$lib/internal/helpers/index.js';
export { removeUndefined };
type KbdKeys = keyof typeof kbd;
/**
 * A wrapper around the internal kbd object to make it easier to use
 * in tests which require the key names to be wrapped in curly braces.
 */
export const testKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce((acc, [key, value]) => {
	acc[key as KbdKeys] = `{${value}}`;
	return acc;
}, {} as Record<KbdKeys, string>);

export function exists(get: (id: string) => HTMLElement, testId: string) {
	try {
		get(testId);
		return true;
	} catch {
		return false;
	}
}
