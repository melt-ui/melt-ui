import type { Readable } from 'svelte/store';

export type EscapeKeydownConfig = {
	/**
	 * Whether the listener is active.
	 *
	 * @defaultValue `true`
	 */
	enabled?: boolean | Readable<boolean>;

	/**
	 * Callback when user presses the escape key element.
	 */
	handler?: (evt: KeyboardEvent) => void;

	/**
	 * A predicate function or a list of elements that should not trigger the event.
	 */
	ignore?: ((e: KeyboardEvent) => boolean) | Element[];
};
