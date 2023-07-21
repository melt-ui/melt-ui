export const isBrowser = typeof document !== 'undefined';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: unknown): v is Function => typeof v === 'function';

/**
 * We are only supporting HTMLElements in Melt UI, so in the
 * rare event someone attempts to use Melt with a non-HTMLElement,
 * we throw an error, rather than silently failing.
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
	if (element instanceof HTMLElement) {
		return true;
	}
	if (!element) {
		return false;
	}
	throw new Error('Only `HTMLElements` are supported by Melt UI builders.');
}

export function isHTMLInputElement(element: unknown): element is HTMLInputElement {
	if (element instanceof HTMLInputElement) {
		return true;
	}
	if (!element) {
		return false;
	}
	throw new Error('Only `HTMLInputElements` can be used with this builder.');
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

export function isLeftClick(event: PointerEvent | MouseEvent): boolean {
	return event.button === 0 && event.ctrlKey === false && event.metaKey === false;
}
