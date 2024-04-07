import { addEventListener } from '$lib/internal/helpers/event.js';
import { isFunction, isHTMLElement, isReadable } from '$lib/internal/helpers/is.js';
import { get, readable, type Readable } from 'svelte/store';
import { effect, executeCallbacks, kbd, noop } from '../../helpers/index.js';
import type { EscapeKeydownConfig } from './types.js';
import type { Action } from 'svelte/action';

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
		});

		// Returns a function to unsubscribe from the event listener and stop tracking keydown events.
		return unsubscribe;
	}
);

export const useEscapeKeydown = ((node, config = {}) => {
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
				if (shouldIgnoreEvent(e, options.ignore)) return;
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
}) satisfies Action<HTMLElement, EscapeKeydownConfig>;

const shouldIgnoreEvent = (e: KeyboardEvent, ignore: EscapeKeydownConfig['ignore']): boolean => {
	if (!ignore) return false;
	if (isFunction(ignore) && ignore(e)) return true;
	if (Array.isArray(ignore) && ignore.some((ignoreEl) => e.target === ignoreEl)) {
		return true;
	}
	return false;
};
