import {
	addEventListener,
	isElement,
	executeCallbacks,
	noop,
} from '$lib/internal/helpers/index.js';
import type { Action } from 'svelte/action';
import type { InteractOutsideConfig, InteractOutsideEvent } from './types.js';

const layers = new Set<HTMLElement>();

const createHighestLayerEventHandlerFactory = (node: HTMLElement) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return <T extends (...args: any[]) => any>(handler: T) => {
		return (...args: Parameters<T>) => {
			if (!isHighestLayerInteractOutside(node)) return;
			handler(...args);
		};
	};
};

export const useInteractOutside = ((node, config = {}) => {
	let unsubEvents = noop;
	let unsubClick = noop;
	layers.add(node);
	const createHighestLayerEventHandler = createHighestLayerEventHandlerFactory(node);

	let isPointerDown = false;
	let isPointerDownInside = false;
	let ignoreEmulatedMouseEvents = false;

	function update(config: InteractOutsideConfig) {
		unsubEvents();
		unsubClick();
		const { onInteractOutside, onInteractOutsideStart, enabled } = { enabled: true, ...config };
		if (!enabled) return;

		const onPointerDown = createHighestLayerEventHandler(
			(e: PointerEvent | MouseEvent | TouchEvent) => {
				if (onInteractOutside && isValidEvent(e, node)) {
					onInteractOutsideStart?.(e);
				}
				const target = e.target;

				if (isElement(target) && isOrContainsTarget(node, target)) {
					isPointerDownInside = true;
				}

				isPointerDown = true;
			}
		);

		function triggerInteractOutside(e: InteractOutsideEvent) {
			onInteractOutside?.(e);
		}

		const documentObj = getOwnerDocument(node);

		// Use pointer events if available, otherwise use mouse/touch events
		if (typeof PointerEvent !== 'undefined') {
			const onPointerUp = createHighestLayerEventHandler((e: PointerEvent) => {
				unsubClick();

				const handler = (e: InteractOutsideEvent) => {
					if (shouldTriggerInteractOutside(e)) {
						triggerInteractOutside(e);
					}
					resetPointerState();
				};

				/**
				 * On touch devices, we need to wait for a click event because browsers implement
				 * a delay between the time the user stops touching the display and when the
				 * browser executes the click event. Without waiting for the click event, the
				 * browser may execute events on other elements that should have been prevented.
				 */
				if (e.pointerType === 'touch') {
					unsubClick = addEventListener(documentObj, 'click', handler, {
						capture: true,
						once: true,
					});
					return;
				}
				handler(e);
			});

			unsubEvents = executeCallbacks(
				addEventListener(documentObj, 'pointerdown', onPointerDown, true),
				addEventListener(documentObj, 'pointerup', onPointerUp, true)
			);
		} else {
			const onMouseUp = createHighestLayerEventHandler((e: MouseEvent) => {
				if (ignoreEmulatedMouseEvents) {
					ignoreEmulatedMouseEvents = false;
				} else if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			});

			const onTouchEnd = createHighestLayerEventHandler((e: TouchEvent) => {
				ignoreEmulatedMouseEvents = true;
				if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			});

			unsubEvents = executeCallbacks(
				addEventListener(documentObj, 'mousedown', onPointerDown, true),
				addEventListener(documentObj, 'mouseup', onMouseUp, true),
				addEventListener(documentObj, 'touchstart', onPointerDown, true),
				addEventListener(documentObj, 'touchend', onTouchEnd, true)
			);
		}
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
			unsubClick();
			layers.delete(node);
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

export function isHighestLayerInteractOutside(node: HTMLElement): boolean {
	const index = Array.from(layers).indexOf(node);
	return index === layers.size - 1;
}

function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}

function getOwnerDocument(el: Element | null | undefined) {
	return el?.ownerDocument ?? document;
}
