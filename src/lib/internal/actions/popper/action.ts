import { createFocusTrap, useClickOutside, useFloating, usePortal } from '$lib/internal/actions';
import {
	addEventListener,
	executeCallbacks,
	kbd,
	type Callback,
	noop,
	isHTMLElement,
} from '$lib/internal/helpers';
import type { Action } from 'svelte/action';
import type { PopperArgs, PopperConfig } from './types';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	clickOutside: {},
	closeOnEscape: true,
	portal: 'body',
} satisfies PopperConfig;

export const usePopper: Action<HTMLElement, PopperArgs> = (popperElement, args) => {
	const { anchorElement, open, options } = args as PopperArgs;
	if (!anchorElement || !open || !options) {
		return { destroy: noop };
	}

	const opts = { ...defaultConfig, ...options } as PopperConfig;

	const callbacks: Callback[] = [];

	if (options.portal !== null) {
		const portal = usePortal(popperElement, options.portal);
		if (portal?.destroy) {
			callbacks.push(portal.destroy);
		}
	}

	callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);

	if (opts.focusTrap !== null) {
		const { useFocusTrap } = createFocusTrap({
			immediate: true,
			escapeDeactivates: false,
			allowOutsideClick: true,
			returnFocusOnDeactivate: false,
			fallbackFocus: popperElement,
			...opts.focusTrap,
		});

		const usedFocusTrap = useFocusTrap(popperElement);

		if (usedFocusTrap?.destroy) {
			callbacks.push(usedFocusTrap.destroy);
		}
	}

	if (opts.clickOutside !== null) {
		callbacks.push(
			useClickOutside(popperElement, {
				enabled: open,
				handler: (e: PointerEvent) => {
					if (e.defaultPrevented) return;

					if (isHTMLElement(anchorElement) && !anchorElement.contains(e.target as Element)) {
						open.set(false);
						anchorElement.focus();
					}
				},
				...opts.clickOutside,
			}).destroy
		);
	}

	if (opts.closeOnEscape) {
		callbacks.push(
			addEventListener(popperElement, 'keydown', (e) => {
				if (e.defaultPrevented) return;
				const event = e as KeyboardEvent;

				switch (event.key) {
					case kbd.ESCAPE:
						open.set(false);
						break;
					default:
				}
			})
		);
	}

	const unsubscribe = executeCallbacks(...callbacks);

	return {
		destroy() {
			unsubscribe();
		},
	};
};
