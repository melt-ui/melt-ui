import type { WithGet } from '$lib/internal/helpers/withGet.js';
import type { Readable } from 'svelte/store';

export type InteractOutsideEvent = PointerEvent | MouseEvent | TouchEvent;

export type InteractOutsideInterceptEventType =
	| 'pointerdown'
	| 'pointerup'
	| 'mousedown'
	| 'mouseup'
	| 'touchstart'
	| 'touchend'
	| 'click';

export type InteractOutsideInterceptHandler<E extends InteractOutsideInterceptEventType> = (
	ev: HTMLElementEventMap[E]
) => void;

export type ClickOutsideBehaviorType =
	| 'close'
	| 'defer-otherwise-close'
	| 'defer-otherwise-ignore'
	| 'ignore';

export type InteractOutsideConfig = {
	/**
	 * Callback fired when an outside interaction event completes,
	 * which is either a `pointerup`, `mouseup`, or `touchend`
	 * event, depending on the user's input device.
	 */
	onInteractOutside?: (e: InteractOutsideEvent) => void;

	/**
	 * Callback fired when an outside interaction event starts,
	 * which is either a `pointerdown`, `mousedown`, or `touchstart`
	 * event, depending on the user's input device.
	 *
	 * This callback is useful when you want to know when the user
	 * begins an outside interaction, but before the interaction
	 * completes.
	 */
	onInteractOutsideStart?: (e: InteractOutsideEvent) => void;

	/**
	 * Click outside behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an outside click.
	 *
	 * @defaultValue `close`
	 */
	behaviorType?: ClickOutsideBehaviorType | WithGet<Readable<ClickOutsideBehaviorType>>;
};
