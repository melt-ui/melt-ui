import { addEventListener, isElement, executeCallbacks, noop } from '$lib/internal/helpers';

type InteractOutsideEvent = PointerEvent | MouseEvent | TouchEvent;

export type InteractOutsideConfig = {
	onInteractOutside?: (e: InteractOutsideEvent) => void;
	onInteractOutsideStart?: (e: InteractOutsideEvent) => void;
	enabled?: boolean;
};

export function initInteractOutside(node: HTMLElement, config: InteractOutsideConfig) {
	const { onInteractOutside, onInteractOutsideStart, enabled } = config;
	if (!enabled) return noop;

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

		const unsub = executeCallbacks(
			addEventListener(documentObj, 'pointerdown', onPointerDown, true),
			addEventListener(documentObj, 'pointerup', onPointerUp, true)
		);

		return unsub;
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

		const unsub = executeCallbacks(
			addEventListener(documentObj, 'mousedown', onPointerDown, true),
			addEventListener(documentObj, 'mouseup', onMouseUp, true),
			addEventListener(documentObj, 'touchstart', onPointerDown, true),
			addEventListener(documentObj, 'touchend', onTouchEnd, true)
		);

		return unsub;
	}
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
