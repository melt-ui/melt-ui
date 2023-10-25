import {
	handleRovingFocus,
	isFunction,
	isHTMLElement,
	sleep,
} from '$lib/internal/helpers/index.js';

export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement | null) => FocusTarget);

type HandleFocusArgs = {
	prop?: FocusProp;
	defaultEl: HTMLElement | null;
	roving?: boolean;
};

export function handleFocus(args: HandleFocusArgs): void {
	const { prop, defaultEl, roving } = args;
	if (prop === undefined) {
		if (roving && defaultEl) {
			/**
			 * Roving focus modifies the tab index of the currently focused element
			 * regardless of who _owns_ that element. We don't want to modify the tab
			 * index of something we do not control/own, so we only do this if the
			 * defaultEl is provided.
			 *
			 * This is primarily used within the Menu builders to manage focus between
			 * menu items.
			 */
			handleRovingFocus(defaultEl);
		} else {
			sleep(1).then(() => defaultEl?.focus());
		}
		return;
	}

	const returned = isFunction(prop) ? prop(defaultEl) : prop;

	if (typeof returned === 'string') {
		// Get el by selector, focus it
		const el = document.querySelector(returned);
		if (!isHTMLElement(el)) return;
		sleep(1).then(() => el.focus());
	} else if (isHTMLElement(returned)) {
		// Focus it
		sleep(1).then(() => returned.focus());
	}
}
