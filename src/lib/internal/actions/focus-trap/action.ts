// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/focusTrap/focusTrap.ts

import type { ActivateOptions, DeactivateOptions, FocusTrap } from 'focus-trap';
import type { FocusTrapConfig, FocusTrapReturn } from './types.js';
import { writable, readonly } from 'svelte/store';
import { createFocusTrap as _createFocusTrap } from 'focus-trap';
import { isFunction } from '$lib/internal/helpers/is.js';
import { isHighestLayerInteractOutside, isHighestLayerEscapeKey } from '../index.js';

export function createFocusTrap(config: FocusTrapConfig = {}) {
	let trap: undefined | FocusTrap;

	const { immediate, ...focusTrapOptions } = config;
	const hasFocus = writable(false);
	const isPaused = writable(false);

	const activate = (opts?: ActivateOptions) => trap?.activate(opts);
	const deactivate = (opts?: DeactivateOptions) => {
		trap?.deactivate(opts);
	};

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
			allowOutsideClick: true,
			...focusTrapOptions,
			escapeDeactivates: (e) => {
				if (!isHighestLayerEscapeKey(node)) return false;
				if (isFunction(focusTrapOptions.escapeDeactivates)) {
					return focusTrapOptions.escapeDeactivates(e);
				}
				return focusTrapOptions.escapeDeactivates ?? true;
			},
			clickOutsideDeactivates: (e) => {
				if (!isHighestLayerInteractOutside(node)) return false;
				if (isFunction(focusTrapOptions.clickOutsideDeactivates)) {
					return focusTrapOptions.clickOutsideDeactivates(e);
				}
				return focusTrapOptions.clickOutsideDeactivates ?? false;
			},
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
		hasFocus: readonly(hasFocus),
		isPaused: readonly(isPaused),
		activate,
		deactivate,
		pause,
		unpause,
	} satisfies FocusTrapReturn;
}
