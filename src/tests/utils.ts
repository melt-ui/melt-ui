import { kbd, removeUndefined } from '$lib/internal/helpers/index.js';
import { fireEvent } from '@testing-library/svelte';
import type { UserEvent } from '@testing-library/user-event';
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

/**
 * Simulates a touch interaction while triggering the
 * same event sequence as in the browser.
 */
export async function touch(node: HTMLElement) {
	await fireEvent(node, new Event('pointerdown', { bubbles: true }));
	await fireEvent(node, new TouchEvent('touchstart', { bubbles: true }));
	await fireEvent(node, new Event('pointerup', { bubbles: true }));
	await fireEvent(node, new TouchEvent('touchend', { bubbles: true }));
	await fireEvent(node, new MouseEvent('mousedown', { bubbles: true }));
	await fireEvent(node, new MouseEvent('mouseup', { bubbles: true }));
	await fireEvent(node, new MouseEvent('click', { bubbles: true }));
}

/**
 * Simulates a specified number of tab key presses to check if the focus remains
 * within the given element, thus determining if a focus trap is active. The `tabsPresses` parameter
 * allows customization of how many tab key presses to simulate, with a default value of 10.
 */
export const assertActiveFocusTrap = async (
	user: UserEvent,
	element: HTMLElement,
	tabsPresses = 10
) => {
	for (let i = 0; i < tabsPresses; i++) {
		await user.tab();
		expect(element).toContainElement(document.activeElement as HTMLElement);
	}
};
