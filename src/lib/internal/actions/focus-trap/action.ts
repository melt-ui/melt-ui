import type { FocusTrapConfig } from './types.js';
import { createFocusTrap as _createFocusTrap } from 'focus-trap';
import { noop } from '$lib/internal/helpers/callbacks.js';
import type { Action } from 'svelte/action';

export const useFocusTrap = ((node, config = {}) => {
	let unsub = noop;

	const update = (config: FocusTrapConfig) => {
		unsub();
		const trap = _createFocusTrap(node, {
			returnFocusOnDeactivate: false,
			allowOutsideClick: true,
			escapeDeactivates: false,
			clickOutsideDeactivates: false,
			...config,
		});
		unsub = trap.deactivate;
		trap.activate();
	};

	update(config);

	return { destroy: unsub, update };
}) satisfies Action<HTMLElement, FocusTrapConfig>;
