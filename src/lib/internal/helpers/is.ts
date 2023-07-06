export const isBrowser = typeof document !== 'undefined';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: unknown): v is Function => typeof v === 'function';

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isHTMLInputElement(element: unknown): element is HTMLInputElement {
	return element instanceof HTMLInputElement;
}

export function isElementDisabled(element: HTMLElement): boolean {
	const ariaDisabled = element.getAttribute('aria-disabled');
	const disabled = element.getAttribute('disabled');

	if (ariaDisabled === 'true' || disabled !== null) {
		return true;
	}

	return false;
}

export function isTouch(event: PointerEvent): boolean {
	return event.pointerType === 'touch';
}
