export function focus(element: unknown) {
	if (isHTMLElement(element)) {
		element.focus();
	}
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}
