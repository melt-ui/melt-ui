import { isElement, last, noop } from '$lib/internal/helpers/index.js';
import type { InteractOutsideEvent } from '../interact-outside/types.js';
import { useInteractOutside } from '../index.js';
import type { ModalConfig } from './types.js';
import type { Action } from 'svelte/action';

const visibleModals: Element[] = [];
export const useModal = ((node, config) => {
	let unsubInteractOutside = noop;
	visibleModals.push(node);

	function removeNodeFromVisibleModals() {
		const index = visibleModals.indexOf(node);
		if (index >= 0) {
			visibleModals.splice(index, 1);
		}
	}

	function isLastModal() {
		return last(visibleModals) === node;
	}

	function update(config: ModalConfig) {
		unsubInteractOutside();
		const { onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config;

		function closeModal() {
			// we only want to call onClose if this is the topmost modal
			if (isLastModal() && onClose) {
				onClose();
				removeNodeFromVisibleModals();
			}
		}
		function onInteractOutsideStart(e: InteractOutsideEvent) {
			const target = e.target;
			if (!isElement(target)) return;
			if (target && isLastModal()) {
				e.stopImmediatePropagation();
			}
		}
		function onInteractOutside(e: InteractOutsideEvent) {
			if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
				e.stopImmediatePropagation();
				closeModal();
			}
		}

		unsubInteractOutside = useInteractOutside(node, {
			onInteractOutsideStart,
			onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
		}).destroy;
	}

	update(config);

	return {
		update,
		destroy() {
			removeNodeFromVisibleModals();
			unsubInteractOutside();
		},
	};
}) satisfies Action<HTMLElement, ModalConfig>;
