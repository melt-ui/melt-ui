import { isElement, noop } from '$lib/internal/helpers/index.js';
import type { InteractOutsideEvent } from '../interact-outside/types.js';
import { useInteractOutside } from '../index.js';
import type { ModalConfig } from './types.js';
import type { Action } from 'svelte/action';

export const useModal = ((node, config) => {
	let unsubInteractOutside = noop;

	function update(config: ModalConfig) {
		unsubInteractOutside();
		const { onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config;

		function closeModal() {
			onClose?.();
		}
		function onInteractOutsideStart(e: InteractOutsideEvent) {
			const target = e.target;
			if (!isElement(target)) return;
			e.stopImmediatePropagation();
		}
		function onInteractOutside(e: InteractOutsideEvent) {
			if (!shouldCloseOnInteractOutside?.(e)) return;
			e.stopImmediatePropagation();
			closeModal();
		}
		unsubInteractOutside = useInteractOutside(node, {
			onInteractOutsideStart,
			onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
			enabled: closeOnInteractOutside,
		}).destroy;
	}

	update(config);

	return {
		update,
		destroy() {
			unsubInteractOutside();
		},
	};
}) satisfies Action<HTMLElement, ModalConfig>;
