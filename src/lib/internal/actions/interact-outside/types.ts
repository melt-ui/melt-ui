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
	ev: HTMLElementEventMap[E],
	computedEventData?: ComputedEventData
) => void;

/**
 * Some event data is lost when the event is delayed, debounced or throttled
 * as described in the dom-spec - https://dom.spec.whatwg.org/#event-path
 * For this reason we can pre-save any needed data and store
 * it here before being passed on the related events
 * */
export type ComputedEventData = { shadowTarget?: EventTarget };

export type InteractOutsideConfig = {
	/**
	 * Callback fired when an outside interaction event completes,
	 * which is either a `pointerup`, `mouseup`, or `touchend`
	 * event, depending on the user's input device.
	 */
	onInteractOutside?: (e: InteractOutsideEvent, computedEventData?: ComputedEventData) => void;

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
	 * Whether or not outside interactions should be handled.
	 * @default true
	 */
	enabled?: boolean;
};
