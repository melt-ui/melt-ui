import { addEventListener } from '$lib/internal/helpers/event.js';
import { isFunction, isHTMLElement, isReadable } from '$lib/internal/helpers/is.js';
import { get, readable, type Readable } from 'svelte/store';
import { effect, executeCallbacks, kbd, noop } from '../../helpers/index.js';
import type { EscapeKeydownConfig } from './types.js';

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
	let unsub = noop;
	function update(config: EscapeKeydownConfig = {}) {
		unsub();

		const options = { enabled: true, ...config };
		const enabled = (
			isReadable(options.enabled) ? options.enabled : readable(options.enabled)
		) as Readable<boolean>;

		unsub = executeCallbacks(
			// Handle escape keydowns
			documentEscapeKeyStore.subscribe((e) => {
				if (!e || !get(enabled)) return;
				const target = e.target;

				if (!isHTMLElement(target) || target.closest('[data-escapee]') !== node) {
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
			}),
			effect(enabled, ($enabled) => {
				if ($enabled) {
					node.dataset.escapee = '';
				} else {
					delete node.dataset.escapee;
				}
			})
		);
	}

	update(config);

	return {
		update,
		destroy() {
			node.removeAttribute('data-escapee');
			unsub();
		},
	};
};
