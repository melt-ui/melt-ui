import { isElement, noop } from '$lib/internal/helpers/index.js';
import type { InteractOutsideEvent } from '../interact-outside/types.js';
import { useInteractOutside } from '../index.js';
import type { ModalConfig } from './types.js';

export function useModal(node: HTMLElement, config: ModalConfig) {
	let unsubInteractOutside = noop;

	function update(config: ModalConfig) {
		unsubInteractOutside();
		const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config;

		function closeModal() {
			onClose?.();
		}
		function onInteractOutsideStart(e: InteractOutsideEvent) {
			const target = e.target;
			if (!isElement(target)) return;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
		function onInteractOutside(e: InteractOutsideEvent) {
			if (!shouldCloseOnInteractOutside?.(e)) return;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			closeModal();
		}
		unsubInteractOutside = useInteractOutside(node, {
			onInteractOutsideStart,
			onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
			enabled: open,
		}).destroy;
	}

	update(config);

	return {
		update,
		destroy() {
			unsubInteractOutside();
		},
	};
}
