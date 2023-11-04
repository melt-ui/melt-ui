import { isHTMLElement } from '$lib/internal/helpers/index.js';

export function pickerOpenFocus(defaultEl?: HTMLElement | null) {
	const focusedCell = document.querySelector('[data-melt-calendar-cell][data-focused]');
	if (isHTMLElement(focusedCell)) return focusedCell;
	if (defaultEl) return defaultEl;
	return null;
}
