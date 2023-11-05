import { isHTMLElement } from '$lib/internal/helpers/index.js';

export function pickerOpenFocus(defaultEl?: HTMLElement | null) {
	const el = document.querySelector('[data-melt-calendar-cell][data-focused]');
	if (isHTMLElement(el)) {
		return el;
	}
	if (isHTMLElement(defaultEl)) {
		return defaultEl;
	}
	return null;
}
