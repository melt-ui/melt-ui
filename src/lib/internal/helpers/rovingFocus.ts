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
	currentFocusedElement.blur();
	sleep(1).then(() => nextElement.focus());
}

function getFocusableElements() {
	return Array.from(
		document.querySelectorAll<HTMLElement>(
			'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
		)
	);
}

export function getNextFocusable(currentElement: HTMLElement): HTMLElement | null {
	const focusableElements = getFocusableElements();

	const currentIndex = focusableElements.indexOf(currentElement);
	const nextIndex = currentIndex + 1;
	return nextIndex < focusableElements.length ? focusableElements[nextIndex] : null;
}

export function getPreviousFocusable(currentElement: HTMLElement): HTMLElement | null {
	const focusableElements = getFocusableElements();
	const currentIndex = focusableElements.indexOf(currentElement);
	const previousIndex = currentIndex - 1;
	return previousIndex >= 0 ? focusableElements[previousIndex] : null;
}
