import { createFocusTrap, useFloating, useClickOutside } from '$lib/internal/actions';
import type { PopperArgs, PopperConfig } from './popper.types';
import { executeCallbacks, kbd } from '$lib/internal/helpers';

const defaultConfig = {
	floating: {},
	focusTrap: {},
	clickOutside: {},
} satisfies PopperConfig;

export function usePopper(args: PopperArgs) {
	const { anchorElement, popperElement, open, options, attach } = args;

	const opts = { ...defaultConfig, ...options } as PopperConfig;

	const unsubscribeFloating = useFloating(anchorElement, popperElement, opts.floating);

	const { useFocusTrap, ...restFocusTrap } = createFocusTrap({
		immediate: true,
		escapeDeactivates: false,
		allowOutsideClick: true,
		returnFocusOnDeactivate: false,
		fallbackFocus: popperElement,
		...opts.focusTrap,
	});

	const unsubscribeFocusTrap = useFocusTrap(popperElement);

	const unsubscribeClickOutside = useClickOutside(popperElement, {
		enabled: open,
		handler: (e: PointerEvent) => {
			if (e.defaultPrevented) return;

			if (!anchorElement?.contains(e.target as Element)) {
				open.set(false);
				anchorElement.focus();
			}
		},
		...opts.clickOutside,
	});

	attach('keydown', (e) => {
		if (e.defaultPrevented) return;

		switch (e.key) {
			case kbd.ESCAPE:
				open.set(false);
				break;
			default:
		}
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
