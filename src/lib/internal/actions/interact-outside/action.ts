import {
	addEventListener,
	isElement,
	executeCallbacks,
	noop,
} from '$lib/internal/helpers/index.js';
import type { InteractOutsideConfig, InteractOutsideEvent } from './types.js';
import type { Action } from 'svelte/action';

export const useInteractOutside = ((node, config) => {
	let unsub = noop;

	let isPointerDown = false;
	let isPointerDownInside = false;

	function update(config: InteractOutsideConfig) {
		unsub();
		const { onInteractOutside, onInteractOutsideStart, enabled } = config;

		if (!enabled) return;

		function onPointerDown(e: InteractOutsideEvent) {
			if (onInteractOutside && isValidEvent(e, node)) {
				onInteractOutsideStart?.(e);
			}
			const target = e.target;

			if (isElement(target) && isOrContainsTarget(node, target)) {
				isPointerDownInside = true;
			}

			isPointerDown = true;
		}

		const onPointerUp = (e: MouseEvent) => {
			if (shouldTriggerInteractOutside(e)) {
				onInteractOutside?.(e);
			}
			resetPointerState();
		};

		const documentObj = getOwnerDocument(node);

		unsub = executeCallbacks(
			addEventListener(documentObj, 'pointerdown', onPointerDown, true),
			addEventListener(documentObj, 'mousedown', onPointerDown, true),
			addEventListener(documentObj, 'touchstart', onPointerDown, true),
			addEventListener(documentObj, 'click', onPointerUp, true)
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
			unsub();
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
