import {
	createFocusTrap,
	useEscapeKeydown,
	useFloating,
	usePortal,
} from '$lib/internal/actions/index.js';
import {
	executeCallbacks,
	type Callback,
	noop,
	isHTMLElement,
} from '$lib/internal/helpers/index.js';
import type { Action } from 'svelte/action';
import type { PopperArgs, PopperConfig } from './types.js';
import { useModal } from '../modal/action.js';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	modal: {},
	escapeKeydown: {},
	portal: 'body',
} satisfies PopperConfig;

export const usePopper = ((popperElement, args) => {
	popperElement.dataset.escapee = '';
	const { anchorElement, open, options } = args as PopperArgs;
	if (!anchorElement || !open || !options) {
		return { destroy: noop };
	}

	const opts = { ...defaultConfig, ...options } as PopperConfig;

	const callbacks: Callback[] = [];

	if (opts.portal !== null) {
		callbacks.push(usePortal(popperElement, opts.portal).destroy);
	}

	callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);

	if (opts.focusTrap !== null) {
		const { useFocusTrap } = createFocusTrap({
			fallbackFocus: popperElement,
			...opts.focusTrap,
		});

		callbacks.push(useFocusTrap(popperElement).destroy);
	}

	if (opts.modal !== null) {
		callbacks.push(
			useModal(popperElement, {
				onClose: () => {
					if (isHTMLElement(anchorElement)) {
						open.set(false);
						anchorElement.focus();
					}
				},
				shouldCloseOnInteractOutside: (e) => {
					if (e.defaultPrevented) return false;

					if (isHTMLElement(anchorElement) && anchorElement.contains(e.target as Element)) {
						return false;
					}

					return true;
				},
				...opts.modal,
			}).destroy
		);
	}

	if (opts.escapeKeydown !== null) {
		callbacks.push(
			useEscapeKeydown(popperElement, {
				enabled: open,
				handler: () => {
					open.set(false);
				},
				...opts.escapeKeydown,
			}).destroy
		);
	}

	// @ts-expect-error - This works and is correct, but TS doesn't like it
	const unsubscribe = executeCallbacks(...callbacks);

	return {
		destroy() {
			unsubscribe();
		},
	};
}) satisfies Action<HTMLElement, PopperArgs>;
