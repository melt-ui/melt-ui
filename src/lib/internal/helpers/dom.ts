import { isHTMLElement } from './is';

export function focus(element: unknown) {
	if (isHTMLElement(element)) {
		element.focus();
	} else if (typeof element === 'string') {
		const el = document.querySelector(element);
		if (isHTMLElement(el)) {
			el.focus();
		}
	}
}
