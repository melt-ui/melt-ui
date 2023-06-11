import { readable, type Readable } from 'svelte/store';
import { addEventListener } from '$lib/internal/helpers/event';
import { get } from 'svelte/store';
import { isFunction } from '$lib/internal/helpers/is';

/**
 * Creates a readable store that tracks the latest PointerEvent that occurred on the document.
 *
 * @returns A function to unsubscribe from the event listener and stop tracking pointer events.
 */
const documentClickStore = readable<PointerEvent | undefined>(undefined, (set): (() => void) => {
	/**
	 * Event handler for pointerdown events on the document.
	 * Updates the store's value with the latest PointerEvent and then resets it to undefined.
	 */
	function clicked(event: PointerEvent | undefined) {
		set(event);

		// New subscriptions will not trigger immediately
		set(undefined);
	}

	// Adds a pointerdown event listener to the document, calling the clicked function when triggered.
	const unsubscribe = addEventListener(document, 'pointerdown', clicked, {
		passive: false,
		capture: true,
	});

	// Returns a function to unsubscribe from the event listener and stop tracking pointer events.
	return unsubscribe;
});

export type ClickOutsideConfig = {
	/**
	 * Whether the listener is active.
	 *
	 * @defaultValue `true`
	 */
	enabled?: boolean | Readable<boolean>;

	/**
	 * Callback when user clicks outside a given element.
	 */
	handler?: (evt: PointerEvent) => void;

	/**
	 * A predicate function or a list of elements that should not trigger the event.
	 */
	ignore?: ((e: PointerEvent) => boolean) | Element[];
};

export const useClickOutside = (node: HTMLElement, config: ClickOutsideConfig = {}) => {
	let options = { enabled: true, ...config };

	// Returns true if the click outside handler is enabled
	function isEnabled(): boolean {
		return typeof options.enabled === 'boolean' ? options.enabled : get(options.enabled);
	}

	// Handle document clicks
	const unsubscribe = documentClickStore.subscribe((e) => {
		// If the click outside handler is disabled, or if the event is null or the node itself, return early
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
		update(params: Partial<ClickOutsideConfig>) {
			options = { ...options, ...params };
		},
		destroy() {
			unsubscribe();
		},
	};
};
