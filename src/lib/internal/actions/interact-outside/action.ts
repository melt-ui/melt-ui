import {
	addEventListener,
	isElement,
	executeCallbacks,
	noop,
} from '$lib/internal/helpers/index.js';
import type { InteractOutsideConfig, InteractOutsideEvent } from './types.js';

const layers = new Set<HTMLElement>();

export function useInteractOutside(node: HTMLElement, config: InteractOutsideConfig) {
	let unsubEvents = noop;

	let isPointerDown = false;
	let isPointerDownInside = false;
	let ignoreEmulatedMouseEvents = false;

	function update(config: InteractOutsideConfig) {
		unsubEvents();
		const { onInteractOutside, onInteractOutsideStart, enabled } = config;
		if (!enabled) {
			layers.delete(node);
			unsubEvents = noop;
			return;
		}
		layers.add(node);

		function onPointerDown(e: PointerEvent | MouseEvent | TouchEvent) {
			if (!isHighestLayer(node)) return;
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

		const documentObj = getOwnerDocument(node);

		// Use pointer events if available, otherwise use mouse/touch events
		if (typeof PointerEvent !== 'undefined') {
			const onPointerUp = (e: PointerEvent) => {
				if (!isHighestLayer(node)) return;
				if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			};

			unsubEvents = executeCallbacks(
				addEventListener(documentObj, 'pointerdown', onPointerDown, true),
				addEventListener(documentObj, 'pointerup', onPointerUp, true)
			);
		} else {
			const onMouseUp = (e: MouseEvent) => {
				if (!isHighestLayer(node)) return;
				if (ignoreEmulatedMouseEvents) {
					ignoreEmulatedMouseEvents = false;
				} else if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			};

			const onTouchEnd = (e: TouchEvent) => {
				if (!isHighestLayer(node)) return;
				ignoreEmulatedMouseEvents = true;
				if (shouldTriggerInteractOutside(e)) {
					triggerInteractOutside(e);
				}
				resetPointerState();
			};

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
			layers.delete(node);
		},
	};
}

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

function isHighestLayer(node: HTMLElement): boolean {
	const index = Array.from(layers).indexOf(node);
	return index === layers.size - 1;
}

function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}

function getOwnerDocument(el: Element | null | undefined) {
	return el?.ownerDocument ?? document;
}
