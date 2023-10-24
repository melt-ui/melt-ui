import { isFunction, isHTMLElement } from '$lib/internal/helpers/index.js';

export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement) => FocusTarget);

type HandleFocusArgs = {
	prop?: FocusProp;
	defaultEl?: HTMLElement;
};

export function handleFocus(args: HandleFocusArgs = {}): void {
	const { prop, defaultEl } = args;
	if (prop === undefined) {
		defaultEl?.focus();
		return;
	}

	const returned = isFunction(prop) ? prop(defaultEl) : prop;

	if (typeof returned === 'string') {
		// Get el by selector, focus it
		const el = document.querySelector(returned);
		if (!isHTMLElement(el)) return;
		el.focus();
	} else if (isHTMLElement(returned)) {
		// Focus it
		returned.focus();
	}
}
