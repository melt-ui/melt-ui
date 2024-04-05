import type { WithGet } from '$lib/internal/helpers/withGet.js';
import type { Readable } from 'svelte/store';

export type EscapeBehaviorType =
	| 'close'
	| 'defer-otherwise-close'
	| 'defer-otherwise-ignore'
	| 'ignore';

export type EscapeKeydownConfig = {
	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	behaviorType?: EscapeBehaviorType | WithGet<Readable<EscapeBehaviorType>>;

	/**
	 * Callback when user presses the escape key element.
	 */
	handler?: (evt: KeyboardEvent) => void;

	/**
	 * A predicate function or a list of elements that should not trigger the event.
	 */
	ignore?: ((e: KeyboardEvent) => boolean) | Element[];
};
