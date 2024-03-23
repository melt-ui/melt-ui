import {
	addEventListener,
	isElement,
	executeCallbacks,
	noop,
	sleep,
} from '$lib/internal/helpers/index.js';
import type {
	InteractOutsideConfig,
	InteractOutsideEvent,
	InteractOutsideInterceptEventType,
	InteractOutsideInterceptHandler,
} from './types.js';
import type { Action } from 'svelte/action';

export const useInteractOutside = ((node, config) => {
	let unsub = noop;
	const documentObj = getOwnerDocument(node);

	let isPointerDown = false;
	let isPointerDownInside = false;

	let ignoreEmulatedMouseEvents = false;
	let ignoreEmulatedPointerEvents = false;

	const interceptedEvents: Record<InteractOutsideInterceptEventType, boolean> = {
		pointerdown: false,
		pointerup: false,
		mousedown: false,
		mouseup: false,
		touchstart: false,
		touchend: false,
		click: false,
	};

	/**
	 * In order to know if an event was intercepted,
	 * we initially mark the event as intercepted during
	 * the capturing phase. Then if the event is not called
	 * again during the bubbling phase, we know it was
	 * intercepted by the user. Otherwise if the event is called
	 * during the bubbling phase, we set `interceptedEvents[e] = false`
	 */
	const createCaptureHandler = (
		eventType: InteractOutsideInterceptEventType,
		{ interactionEnd }: { interactionEnd?: boolean } = {}
	) => {
		const handler = () => {
			interceptedEvents[eventType] = true;
			/**
			 * We should only reset `interceptedEvents` if this is an
			 * interaction end event. This allows the user to intercept interaction
			 * start events and so we maintain the `interceptedEvents` state
			 * until the interaction end event occurs.
			 */
			if (interactionEnd) {
				clearTimeout(resetInterceptedEventsTimeout);
				resetInterceptedEventsTimeout = setTimeout(resetInterceptedEvents, 10);
			}
		};
		return addEventListener(documentObj, eventType, handler, true);
	};

	/**
	 * This creates an event listener for the bubbling phase
	 * which marks the event as not intercepted. Only if no other
	 * events were intercepted, we call the handler.
	 */
	const createBubblingHandler = <E extends InteractOutsideInterceptEventType>(
		eventType: E,
		handler?: InteractOutsideInterceptHandler<E>,
		options?: boolean | AddEventListenerOptions
	) => {
		return addEventListener(
			documentObj,
			eventType,
			(e: HTMLElementEventMap[E]) => {
				/**
				 * We get here only if the user did not
				 * intercept this event during the bubbling phase.
				 */
				interceptedEvents[eventType] = false;

				/**
				 * Wait for all other events that were not intercepted
				 * to update `interceptedEvents[e] = false` before
				 * we check if an event was intercepted.
				 */
				sleep(10).then(() => {
					/**
					 * If user intercepted a different interaction event,
					 * we should not call the handler.
					 */
					for (const isIntercepted of Object.values(interceptedEvents)) {
						if (isIntercepted) return;
					}
					handler?.(e);
				});
			},
			options
		);
	};

	function update(config: InteractOutsideConfig) {
		unsub();
		clearTimeout(resetInterceptedEventsTimeout);
		const { onInteractOutside, onInteractOutsideStart, enabled } = config;

		if (!enabled) return;

		function onPointerDown(e: PointerEvent | MouseEvent | TouchEvent) {
			if (onInteractOutside && isValidEvent(e, node)) {
				onInteractOutsideStart?.(e);
			}
			const target = e.target;

			if (isElement(target) && isOrContainsTarget(node, target)) {
				isPointerDownInside = true;
			}

			isPointerDown = true;
		}

		function triggerInteractOutside(e: InteractOutsideEvent) {
			onInteractOutside?.(e);
		}

		const onMouseUp = (e: MouseEvent) => {
			/**
			 * Wait for `touchend` or `pointerup` events to
			 * potentially set `ignoreEmulatedMouseEvents` to true.
			 */
			sleep(0).then(() => {
				if (ignoreEmulatedMouseEvents) {
					ignoreEmulatedMouseEvents = false;
				} else if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			});
		};

		const onTouchEnd = (e: TouchEvent) => {
			ignoreEmulatedMouseEvents = true;
			ignoreEmulatedPointerEvents = true;
			if (shouldTriggerInteractOutside(e)) {
				triggerInteractOutside(e);
			}
			resetPointerState();
		};

		const onPointerUp = (e: PointerEvent) => {
			ignoreEmulatedMouseEvents = true;
			/**
			 * Wait for `touchend` event to potentially
			 * set `ignoreEmulatedPointerEvents` to true.
			 */
			sleep(0).then(() => {
				if (ignoreEmulatedPointerEvents) {
					ignoreEmulatedPointerEvents = false;
				} else if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			});
		};

		unsub = executeCallbacks(
			/** Capture Events For Interaction Start */
			createCaptureHandler('pointerdown'),
			createCaptureHandler('mousedown'),
			createCaptureHandler('touchstart'),
			/** Capture Events For Interaction End */
			createCaptureHandler('pointerup', { interactionEnd: true }),
			createCaptureHandler('mouseup', { interactionEnd: true }),
			createCaptureHandler('touchend', { interactionEnd: true }),
			createCaptureHandler('click', { interactionEnd: true }),
			/** Bubbling Events For Interaction Start */
			createBubblingHandler('pointerdown', onPointerDown),
			createBubblingHandler('mousedown', onPointerDown),
			createBubblingHandler('touchstart', onPointerDown, { passive: false }),
			/** Bubbling Events For Interaction End */
			createBubblingHandler('pointerup', onPointerUp),
			createBubblingHandler('mouseup', onMouseUp),
			createBubblingHandler('touchend', onTouchEnd),
			createBubblingHandler('click')
		);
	}

	function shouldTriggerInteractOutside(e: InteractOutsideEvent) {
		if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
			return true;
		}
		return false;
	}

	function resetPointerState() {
		isPointerDown = false;
		isPointerDownInside = false;
	}

	let resetInterceptedEventsTimeout: NodeJS.Timeout;
	function resetInterceptedEvents() {
		for (const eventType in interceptedEvents) {
			interceptedEvents[eventType as InteractOutsideInterceptEventType] = false;
		}
	}

	update(config);

	return {
		update,
		destroy() {
			unsub();
			clearTimeout(resetInterceptedEventsTimeout);
		},
	};
}) satisfies Action<HTMLElement, InteractOutsideConfig>;

function isValidEvent(e: InteractOutsideEvent, node: HTMLElement): boolean {
	if ('button' in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;

	// if the target is no longer in the document (e.g. it was removed) ignore it
	const ownerDocument = target.ownerDocument;
	if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
		return false;
	}

	return node && !isOrContainsTarget(node, target);
}

function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}

function getOwnerDocument(el: Element | null | undefined) {
	return el?.ownerDocument ?? document;
}
