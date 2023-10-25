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
	defaultEl: HTMLElement | null
	roving?: boolean;
};

export function handleFocus(args: HandleFocusArgs): void {
	const { prop, defaultEl, roving } = args;
	if (prop === undefined) {
		if (roving && defaultEl) {
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
