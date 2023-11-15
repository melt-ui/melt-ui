import { readable } from 'svelte/store';
import { addEventListener } from '$lib/internal/helpers/event.js';
import { get } from 'svelte/store';
import { isFunction, isHTMLElement } from '$lib/internal/helpers/is.js';
import type { EscapeKeydownConfig } from './types.js';
import { kbd } from '../../helpers/index.js';

/**
 * Creates a readable store that tracks the latest Escape Keydown that occurred on the document.
 *
 * @returns A function to unsubscribe from the event listener and stop tracking keydown events.
 */
const documentEscapeKeyStore = readable<KeyboardEvent | undefined>(
	undefined,
	(set): (() => void) => {
		/**
		 * Event handler for keydown events on the document.
		 * Updates the store's value with the latest Escape Keydown event and then resets it to undefined.
		 */
		function keydown(event: KeyboardEvent | undefined) {
			if (event && event.key === kbd.ESCAPE) {
				set(event);
			}

			// New subscriptions will not trigger immediately
			set(undefined);
		}

		// Adds a keydown event listener to the document, calling the keydown function when triggered.
		const unsubscribe = addEventListener(document, 'keydown', keydown, {
			passive: false,
			capture: true,
		});

		// Returns a function to unsubscribe from the event listener and stop tracking keydown events.
		return unsubscribe;
	}
);

export const useEscapeKeydown = (node: HTMLElement, config: EscapeKeydownConfig = {}) => {
	node.dataset.escapee = '';
	let options = { enabled: true, ...config };

	// Returns true if the escape keydown handler is enabled
	function isEnabled(): boolean {
		return typeof options.enabled === 'boolean' ? options.enabled : get(options.enabled);
	}

	// Handle escape keydowns
	const unsubscribe = documentEscapeKeyStore.subscribe((e) => {
		if (!e || !isEnabled()) return;
		const target = e.target;

		if (!isHTMLElement(target) || target.closest("[data-escapee][data-state='open']") !== node) {
			return;
		}

		e.preventDefault();

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
						return ignoreEl && target === ignoreEl;
					})
				)
					return;
			}
		}

		// If none of the above conditions are met, call the handler
		options.handler?.(e);
	});

	return {
		update(params: Partial<EscapeKeydownConfig>) {
			options = { ...options, ...params };
		},
		destroy() {
			node.removeAttribute('data-escapee');
			unsubscribe();
		},
	};
};
