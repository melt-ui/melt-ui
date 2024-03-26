import {
	addEventListener,
	isElement,
	executeCallbacks,
	noop,
	debounce,
} from '$lib/internal/helpers/index.js';
import type {
	InteractOutsideConfig,
	InteractOutsideEvent,
	InteractOutsideInterceptEventType,
	InteractOutsideInterceptHandler,
} from './types.js';
import type { Action } from 'svelte/action';

export const useInteractOutside = ((node, config) => {
	let unsubEvents = noop;
	let unsubPointerDown = noop;
	let unsubPointerUp = noop;
	let unsubResetInterceptedEvents = noop;

	const documentObj = getOwnerDocument(node);

	let isPointerDown = false;
	let isPointerDownInside = false;

	const interceptedEvents: Record<InteractOutsideInterceptEventType, boolean> = {
		pointerdown: false,
		pointerup: false,
		mousedown: false,
		mouseup: false,
		touchstart: false,
		touchend: false,
		click: false,
	};

	const resetInterceptedEvents = () => {
		for (const eventType in interceptedEvents) {
			interceptedEvents[eventType as InteractOutsideInterceptEventType] = false;
		}
	};

	const isAnyEventIntercepted = () => {
		for (const isIntercepted of Object.values(interceptedEvents)) {
			if (isIntercepted) return true;
		}
		return false;
	};

	/**
	 * In order to know if an event was intercepted,
	 * we initially mark the event as intercepted during
	 * the capturing phase. Then if the event is not called
	 * again during the bubbling phase, we know it was
	 * intercepted by the user.
	 */
	const setupCapturePhaseHandlerAndMarkAsIntercepted = <
		E extends InteractOutsideInterceptEventType
	>(
		eventType: E,
		handler?: InteractOutsideInterceptHandler<E>
	) => {
		return addEventListener(
			documentObj,
			eventType,
			(e: HTMLElementEventMap[E]) => {
				interceptedEvents[eventType] = true;
				handler?.(e);
			},
			true
		);
	};

	/**
	 * We create an event listener for the bubbling phase
	 * which marks the event as not intercepted.
	 */
	const setupBubblePhaseHandlerAndMarkAsNotIntercepted = <
		E extends InteractOutsideInterceptEventType
	>(
		eventType: E,
		handler?: InteractOutsideInterceptHandler<E>,
		options?: boolean | AddEventListenerOptions
	) => {
		return addEventListener(
			documentObj,
			eventType,
			(e: HTMLElementEventMap[E]) => {
				interceptedEvents[eventType] = false;
				handler?.(e);
			},
			options
		);
	};

	function update(config: InteractOutsideConfig) {
		unsubEvents();
		unsubPointerDown();
		unsubPointerUp();
		unsubResetInterceptedEvents();
		resetInterceptedEvents();
		const { onInteractOutside, onInteractOutsideStart, enabled } = config;
		if (!enabled) return;

		const resetInterceptedEventsDebounced = debounce(resetInterceptedEvents, 20);
		unsubResetInterceptedEvents = resetInterceptedEventsDebounced.destroy;

		/**
		 * We debounce onPointerDown to allow other events to be marked
		 * as not intercepted before we check if any events were intercepted.
		 */
		const onPointerDown = debounce((e: InteractOutsideEvent) => {
			if (isAnyEventIntercepted()) return;
			if (onInteractOutside && isValidEvent(e, node)) onInteractOutsideStart?.(e);
			const target = e.target;
			if (isElement(target) && isOrContainsTarget(node, target)) {
				isPointerDownInside = true;
			}
			isPointerDown = true;
		}, 10);
		unsubPointerDown = onPointerDown.destroy;

		/**
		 * We debounce onPointerUp to allow other events to be marked
		 * as not intercepted before we check if any events were intercepted.
		 */
		const onPointerUp = debounce((e: InteractOutsideEvent) => {
			if (isAnyEventIntercepted()) return;
			if (shouldTriggerInteractOutside(e)) onInteractOutside?.(e);
			resetPointerState();
		}, 10);
		unsubPointerUp = onPointerUp.destroy;

		unsubEvents = executeCallbacks(
			/** Capture Events at Interaction Start */
			setupCapturePhaseHandlerAndMarkAsIntercepted('pointerdown'),
			setupCapturePhaseHandlerAndMarkAsIntercepted('mousedown'),
			setupCapturePhaseHandlerAndMarkAsIntercepted('touchstart'),
			/**
			 * Capture Events at Interaction End
			 * We reset the intercepted events only at the end of an interaction
			 * to allow the user to intercept the beginning of an interaction
			 * while still intercepting the entire interaction.
			 */
			setupCapturePhaseHandlerAndMarkAsIntercepted('pointerup', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('mouseup', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('touchend', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('click', resetInterceptedEventsDebounced),
			/** Bubbling Events For Interaction Start */
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('pointerdown', onPointerDown),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('mousedown', onPointerDown),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('touchstart', onPointerDown),
			/**
			 * Bubbling Events For Interaction End
			 * We must listen to all interaction end events vs. only `click` events
			 * because on a touch device, if you press on the screen, move your finger
			 * and lift it, the `click` event won't trigger but we should still call `onPointerUp`.
			 */
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('pointerup', onPointerUp),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('mouseup', onPointerUp),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('touchend', onPointerUp),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('click', onPointerUp)
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

	update(config);

	return {
		update,
		destroy() {
			unsubEvents();
			unsubPointerDown();
			unsubPointerUp();
			unsubResetInterceptedEvents();
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
