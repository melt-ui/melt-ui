import { createFocusTrap, useClickOutside, useFloating, usePortal } from '$lib/internal/actions';
import { addEventListener, executeCallbacks, kbd } from '$lib/internal/helpers';
import type { Action } from 'svelte/action';
import { noop } from 'svelte/internal';
import type { PopperArgs, PopperConfig } from './popper.types';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	clickOutside: {},
	portal: 'body',
} satisfies PopperConfig;

export const usePopper: Action<HTMLElement, PopperArgs> = (popperElement, args) => {
	const { anchorElement, open, options } = args ?? {};
	if (!(open && anchorElement && options)) return { destroy: noop };

	const opts = { ...defaultConfig, ...options } as PopperConfig;

	let portal: ReturnType<typeof usePortal> | null = null;

	if (options.portal !== null) {
		portal = usePortal(popperElement, options.portal);
	}

	const unsubFloating = useFloating(anchorElement, popperElement, opts.floating).destroy;

	let unsubFocusTrap = noop;
	if (options.focusTrap !== null) {
		const { useFocusTrap } = createFocusTrap({
			immediate: true,
			escapeDeactivates: false,
			allowOutsideClick: true,
			returnFocusOnDeactivate: false,
			fallbackFocus: popperElement,
			...opts.focusTrap,
		});

		const usedFocusTrap = useFocusTrap(popperElement);

		if (usedFocusTrap && usedFocusTrap.destroy) {
			unsubFocusTrap = () => usedFocusTrap.destroy;
		}
	}

	let unsubClickOutside = noop;

	if (options.clickOutside !== null) {
		unsubClickOutside = useClickOutside(popperElement, {
			enabled: open,
			handler: (e: PointerEvent) => {
				if (e.defaultPrevented) return;

				if (!anchorElement?.contains(e.target as Element)) {
					open.set(false);
					anchorElement.focus();
				}
			},
			...opts.clickOutside,
		}).destroy;
	}

	const removeKeydown = addEventListener(popperElement, 'keydown', (e) => {
		if (e.defaultPrevented) return;
		const event = e as KeyboardEvent;

		switch (event.key) {
			case kbd.ESCAPE:
				open.set(false);
				break;
			default:
		}
	});

	const unsubscribe = executeCallbacks(
		unsubFloating,
		unsubClickOutside,
		unsubFocusTrap,
		removeKeydown,
		portal && portal.destroy ? portal.destroy : noop
	);

	return {
		destroy: unsubscribe,
	};
};
