import { isHTMLElement } from '$lib/internal/helpers/index.js';

export function pickerOpenFocus(_?: HTMLElement | null) {
	return document.querySelector('[data-melt-calendar-cell][data-focused]');
}
