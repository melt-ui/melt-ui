import { addEventListener, isElement, executeCallbacks, noop } from '$lib/internal/helpers';
import type { InteractOutsideConfig, InteractOutsideEvent } from './types.js';

export function useInteractOutside(node: HTMLElement, config: InteractOutsideConfig) {
	let unsub = noop;
	function update(config: InteractOutsideConfig) {
		unsub();
		const { onInteractOutside, onInteractOutsideStart, enabled } = config;

		if (!enabled) {
			return {
				destroy: unsub,
			};
		}

		let isPointerDown = false;
		let ignoreEmulatedMouseEvents = false;

		function onPointerDown(e: PointerEvent | MouseEvent | TouchEvent) {
			if (onInteractOutside && isValidEvent(e, node)) {
				onInteractOutsideStart?.(e);
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
				if (isPointerDown && isValidEvent(e, node)) {
					triggerInteractOutside(e);
				}
				isPointerDown = false;
			};

			unsub = executeCallbacks(
				addEventListener(documentObj, 'pointerdown', onPointerDown, true),
				addEventListener(documentObj, 'pointerup', onPointerUp, true)
			);
		} else {
			const onMouseUp = (e: MouseEvent) => {
				if (ignoreEmulatedMouseEvents) {
					ignoreEmulatedMouseEvents = false;
				} else if (isPointerDown && isValidEvent(e, node)) {
					triggerInteractOutside(e);
				}
				isPointerDown = false;
			};

			const onTouchEnd = (e: TouchEvent) => {
				ignoreEmulatedMouseEvents = true;
				if (isPointerDown && isValidEvent(e, node)) {
					triggerInteractOutside(e);
				}
				isPointerDown = false;
			};

			unsub = executeCallbacks(
				addEventListener(documentObj, 'mousedown', onPointerDown, true),
				addEventListener(documentObj, 'mouseup', onMouseUp, true),
				addEventListener(documentObj, 'touchstart', onPointerDown, true),
				addEventListener(documentObj, 'touchend', onTouchEnd, true)
			);
		}
	}

	update(config);

	return {
		update,
		destroy: unsub,
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

	return node && !node.contains(target);
}

function getOwnerDocument(el: Element | null | undefined) {
	return el?.ownerDocument ?? document;
}
