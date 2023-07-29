import { isHTMLElement } from './is';

/** Retrieves all option descendants of a given element. */
export function getOptions(el: HTMLElement): HTMLElement[] {
	return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter(
		(el): el is HTMLElement => isHTMLElement(el)
	);
}

/** Retrieves the first option descendant of a given element. */
export function getFirstOption(el: HTMLElement): HTMLElement | null {
	const firstOption = el.querySelector('[role="option"]:not([data-disabled])');

	return isHTMLElement(firstOption) ? firstOption : null;
}
