import {
	createFocusTrap,
	useClickOutside,
	useEscapeKeydown,
	useFloating,
	usePortal,
} from '$lib/internal/actions';
import { executeCallbacks, type Callback, noop, isHTMLElement } from '$lib/internal/helpers';
import type { Action } from 'svelte/action';
import type { PopperArgs, PopperConfig } from './types';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	clickOutside: {},
	escapeKeydown: {},
	portal: 'body',
} satisfies PopperConfig;

export const usePopper: Action<HTMLElement, PopperArgs> = (popperElement, args) => {
	popperElement.dataset.escapee = '';
	const { anchorElement, open, options } = args satisfies PopperArgs;
	if (!anchorElement || !open || !options) {
		return { destroy: noop };
	}

	const opts = { ...defaultConfig, ...options } as PopperConfig;

	const callbacks: Callback[] = [];

	if (opts.portal !== null) {
		const portal = usePortal(popperElement, opts.portal);
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

	if (opts.escapeKeydown !== null) {
		callbacks.push(
			useEscapeKeydown(popperElement, {
				enabled: open,
				handler: (e: KeyboardEvent) => {
					if (e.defaultPrevented) return;
					open.set(false);
				},
				...opts.escapeKeydown,
			}).destroy
		);
	}

	const unsubscribe = executeCallbacks(...callbacks);

	return {
		destroy() {
			unsubscribe();
		},
	};
};
