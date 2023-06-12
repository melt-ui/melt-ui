import { createFocusTrap, useFloating, useClickOutside } from '$lib/internal/actions';
import type { Writable } from 'svelte/store';
import type { PopperConfig } from './popper.types';
import { executeCallbacks } from '$lib/internal/helpers';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	clickOutside: {},
} satisfies PopperConfig;

export function usePopper(
	anchorElement: HTMLElement,
	contentElement: HTMLElement,
	open: Writable<boolean>,
	opts?: PopperConfig
) {
	const options = { ...defaultConfig, ...opts } as PopperConfig;

	const unsubscribeFloating = useFloating(anchorElement, contentElement, options.floating);

	const { useFocusTrap, ...restFocusTrap } = createFocusTrap({
		immediate: true,
		escapeDeactivates: false,
		allowOutsideClick: true,
		returnFocusOnDeactivate: false,
		fallbackFocus: contentElement,
		...options.focusTrap,
	});

	const unsubscribeFocusTrap = useFocusTrap(contentElement);

	const unsubscribeClickOutside = useClickOutside(contentElement, {
		enabled: open,
		handler: (e: PointerEvent) => {
			if (e.defaultPrevented) return;

			if (!anchorElement?.contains(e.target as Element)) {
				open.set(false);
				anchorElement.focus();
			}
		},
		...options.clickOutside,
	});

	const unsubscribe = executeCallbacks(
		unsubscribeFloating,
		unsubscribeClickOutside,
		unsubscribeFocusTrap
	);

	return {
		focusTrap: restFocusTrap,
		unsubscribe,
	};
}
