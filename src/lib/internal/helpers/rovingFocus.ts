import { isBrowser, isHTMLElement } from './is';
import { sleep } from './sleep';

/**
 * Manage roving focus between elements. Sets the current active element to
 * tabindex -1 and the next element to tabindex 0.
 *
 * @param nextElement The element to focus on
 */
export function handleRovingFocus(nextElement: HTMLElement) {
	if (!isBrowser) return;

	const currentFocusedElement = document.activeElement;
	if (!isHTMLElement(currentFocusedElement)) return;

	if (currentFocusedElement === nextElement) return;

	currentFocusedElement.tabIndex = -1;

	nextElement.tabIndex = 0;
	sleep(1).then(() => nextElement.focus());
}
