// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/focusTrap/focusTrap.ts

import type { ActivateOptions, DeactivateOptions, FocusTrap } from 'focus-trap';
import type { FocusTrapConfig, FocusTrapReturn } from './focusTrap.types';
import { writable } from 'svelte/store';
import { createFocusTrap as _createFocusTrap } from 'focus-trap';
import { toReadable } from '$lib/internal/helpers';

export function createFocusTrap(config: FocusTrapConfig = {}): FocusTrapReturn {
	let trap: undefined | FocusTrap;

	const { immediate, ...focusTrapOptions } = config;
	const hasFocus = writable(false);
	const isPaused = writable(false);

	const activate = (opts?: ActivateOptions) => trap?.activate(opts);
	const deactivate = (opts?: DeactivateOptions) => trap?.deactivate(opts);

	const pause = () => {
		if (trap) {
			trap.pause();
			isPaused.set(true);
		}
	};

	const unpause = () => {
		if (trap) {
			trap.unpause();
			isPaused.set(false);
		}
	};

	const useFocusTrap = (node: HTMLElement) => {
		trap = _createFocusTrap(node, {
			...focusTrapOptions,
			onActivate() {
				hasFocus.set(true);
				config.onActivate?.();
			},
			onDeactivate() {
				hasFocus.set(false);
				config.onDeactivate?.();
			},
		});

		if (immediate) {
			activate();
		}

		return {
			destroy() {
				deactivate();
				trap = undefined;
			},
		};
	};

	return {
		useFocusTrap,
		hasFocus: toReadable(hasFocus),
		isPaused: toReadable(isPaused),
		activate,
		deactivate,
		pause,
		unpause,
	};
}

//
// Taken from github.com/carbon-design-system/carbon/packages/react/src/internal/keyboard/navigation.js
//

// add all the elements inside modal which you want to make focusable
const selectorTabbable = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']):not([disabled]), *[contenteditable=true]
`;

export default function useFocusTrap(node: HTMLElement) {
	function handleFocusTrap(e: KeyboardEvent) {
		let isTabPressed = e.key === 'Tab';

		if (!isTabPressed) {
			return;
		}

		const tabbable = Array.from(node.querySelectorAll(selectorTabbable));

		let index = tabbable.indexOf(document.activeElement ?? node);
		if (index === -1 && e.shiftKey) index = 0;
		index += tabbable.length + (e.shiftKey ? -1 : 1);
		index %= tabbable.length;
		/** @ts-ignore */
		tabbable[index].focus();

		e.preventDefault();
	}

	document.addEventListener('keydown', handleFocusTrap, true);

	return {
		destroy() {
			document.removeEventListener('keydown', handleFocusTrap, true);
		},
	};
}
