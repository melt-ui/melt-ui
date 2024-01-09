import { isFunction, isHTMLElement, sleep } from '$lib/internal/helpers/index.js';
import { tick } from 'svelte';

export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement | null) => FocusTarget);

type HandleFocusArgs = {
	prop?: FocusProp;
	defaultEl: HTMLElement | null;
};

export async function handleFocus(args: HandleFocusArgs): Promise<void> {
	const { prop, defaultEl } = args;

	await Promise.all([sleep(1), tick]);

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
