import { readable } from 'svelte/store';
import { addEventListener } from '$lib/internal/helpers/event';
import { get } from 'svelte/store';
import { isFunction } from '$lib/internal/helpers/is';
import type { FocusOutsideConfig } from './focusOutside.types';

/**
 * Creates a readable store that tracks the latest FocusIn events that occurred on the document.
 *
 * @returns A function to unsubscribe from the event listener and stop tracking focus events.
 */
const documentFocusStore = readable<FocusEvent | undefined>(undefined, (set): (() => void) => {
	/**
	 * Event handler for focusin events on the document.
	 * Updates the store's value with the latest FocusEvent and then resets it to undefined.
	 */
	function focused(event: FocusEvent | undefined) {
		set(event);

		// New subscriptions will not trigger immediately
		set(undefined);
	}

	const unsubscribe = addEventListener(document, 'focusin', focused, {
		passive: false,
		capture: true,
	});

	return unsubscribe;
});

export const useFocusOutside = (node: HTMLElement, config: FocusOutsideConfig = {}) => {
	let options = { enabled: true, ...config };

	function isEnabled(): boolean {
		return typeof options.enabled === 'boolean' ? options.enabled : get(options.enabled);
	}

	// Handle document focus events
	const unsubscribe = documentFocusStore.subscribe((e) => {
		// If the focus outside handler is disabled, or if the event is null or the node itself, return early
		if (!isEnabled() || !e || e.target === node) {
			return;
		}

		const composedPath = e.composedPath();

		// If the target is in the node, return early
		if (composedPath.includes(node)) return;

		// If an ignore function is passed, check if it returns true
		if (options.ignore) {
			if (isFunction(options.ignore)) {
				if (options.ignore(e)) return;
			}
			// If an ignore array is passed, check if any elements in the array match the target
			else if (Array.isArray(options.ignore)) {
				if (
					options.ignore.length > 0 &&
					options.ignore.some((ignoreEl) => {
						return ignoreEl && (e.target === ignoreEl || composedPath.includes(ignoreEl));
					})
				)
					return;
			}
		}

		// If none of the above conditions are met, call the handler
		options.handler?.(e);
	});

	return {
		update(params: Partial<FocusOutsideConfig>) {
			options = { ...options, ...params };
		},
		destroy() {
			unsubscribe();
		},
	};
};
