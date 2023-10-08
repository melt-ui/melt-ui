export const isBrowser = typeof document !== 'undefined';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: unknown): v is Function => typeof v === 'function';

export const isLetter = (key: string) => /^[a-z]$/i.test(key);

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isHTMLInputElement(element: unknown): element is HTMLInputElement {
	return element instanceof HTMLInputElement;
}

export function isHTMLLabelElement(element: unknown): element is HTMLLabelElement {
	return element instanceof HTMLLabelElement;
}

export function isElementDisabled(element: HTMLElement): boolean {
	const ariaDisabled = element.getAttribute('aria-disabled');
	const disabled = element.getAttribute('disabled');
	const dataDisabled = element.hasAttribute('data-disabled');

	if (ariaDisabled === 'true' || disabled !== null || dataDisabled) {
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

export function isFocusVisible(element: Element): boolean {
	return element.matches(':focus-visible');
}

export function isNull(value: unknown): value is null {
	return value === null;
}

export function isNumberKey(key: string) {
	if (isNaN(parseInt(key))) return false;
	return true;
}

export function isTabKey(key: string) {
	return key === 'Tab';
}
