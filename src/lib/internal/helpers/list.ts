/** Retrieves all option descendants of a given element. */
export function getOptions(el: HTMLElement): HTMLElement[] {
	return Array.from(el.querySelectorAll('[role="option"]'));
}

/** Retrieves the first option descendant of a given element. */
export function getFirstOption(el: HTMLElement) {
	return el.querySelector('[role="option"]');
}
