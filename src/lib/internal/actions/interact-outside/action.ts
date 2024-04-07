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
	 * To determine event interception, events are marked as intercepted in the capture phase.
	 * If they are not invoked again in the bubbling phase, it indicates user interception.
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
	 * An event listener for the bubbling phase marks events as not intercepted.
	 */
	const setupBubblePhaseHandlerAndMarkAsNotIntercepted = <
		E extends InteractOutsideInterceptEventType
	>(
		eventType: E,
		handler?: InteractOutsideInterceptHandler<E>
	) => {
		return addEventListener(documentObj, eventType, (e: HTMLElementEventMap[E]) => {
			interceptedEvents[eventType] = false;
			handler?.(e);
		});
	};

	function update(config: InteractOutsideConfig) {
		unsubEvents();
		unsubPointerDown();
		unsubPointerUp();
		unsubResetInterceptedEvents();
		resetInterceptedEvents();
		const { onInteractOutside, onInteractOutsideStart, enabled } = { enabled: true, ...config };
		if (!enabled) return;

		/**
		 * Debouncing `onPointerDown` ensures that other events can be flagged as not intercepted,
		 * allowing a comprehensive check for intercepted events thereafter.
		 */
		const onPointerDownDebounced = debounce((e: InteractOutsideEvent) => {
			if (isAnyEventIntercepted()) return;
			if (onInteractOutside && isValidEvent(e, node)) onInteractOutsideStart?.(e);
			const target = e.target;
			if (isElement(target) && isOrContainsTarget(node, target)) {
				isPointerDownInside = true;
			}
			isPointerDown = true;
		}, 10);
		unsubPointerDown = onPointerDownDebounced.destroy;

		/**
		 * Debouncing `onPointerUp` ensures that other events can be flagged as not intercepted,
		 * allowing a comprehensive check for intercepted events thereafter.
		 */
		const onPointerUpDebounced = debounce((e: InteractOutsideEvent) => {
			if (isAnyEventIntercepted()) return;
			if (shouldTriggerInteractOutside(e)) onInteractOutside?.(e);
			resetPointerState();
		}, 10);
		unsubPointerUp = onPointerUpDebounced.destroy;

		/**
		 * Debounces `resetInterceptedEvents` to avoid premature resetting while events are still firing. The debounce
		 * delay is intentionally set longer than `onPointerUp`'s to ensure `onPointerUp` events are fully processed
		 * during the bubbling phase before `resetInterceptedEventsDebounced` executes in the capture phase.
		 */
		const resetInterceptedEventsDebounced = debounce(resetInterceptedEvents, 20);
		unsubResetInterceptedEvents = resetInterceptedEventsDebounced.destroy;

		unsubEvents = executeCallbacks(
			/** Capture Events For Interaction Start */
			setupCapturePhaseHandlerAndMarkAsIntercepted('pointerdown'),
			setupCapturePhaseHandlerAndMarkAsIntercepted('mousedown'),
			setupCapturePhaseHandlerAndMarkAsIntercepted('touchstart'),
			/**
			 * Intercepted events are reset only at the end of an interaction, allowing
			 * interception at the start while still capturing the entire interaction.
			 * Additionally, intercepted events are reset in the capture phase with `resetInterceptedEventsDebounced`,
			 * accommodating events not invoked in the bubbling phase due to user interception.
			 */
			setupCapturePhaseHandlerAndMarkAsIntercepted('pointerup', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('mouseup', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('touchend', resetInterceptedEventsDebounced),
			setupCapturePhaseHandlerAndMarkAsIntercepted('click', resetInterceptedEventsDebounced),

			/** Bubbling Events For Interaction Start */
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('pointerdown', onPointerDownDebounced),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('mousedown', onPointerDownDebounced),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('touchstart', onPointerDownDebounced),
			/**
			 * To effectively detect an end of an interaction, we must monitor all relevant events,
			 * not just `click` events. This is because on touch devices, actions like pressing,
			 * moving the finger, and lifting it off the screen may not trigger a `click` event,
			 * but should still invoke `onPointerUp` to properly handle the interaction.
			 */
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('pointerup', onPointerUpDebounced),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('mouseup', onPointerUpDebounced),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('touchend', onPointerUpDebounced),
			setupBubblePhaseHandlerAndMarkAsNotIntercepted('click', onPointerUpDebounced)
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
