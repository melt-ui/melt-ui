import { isElement, kbd, last, noop, sleep } from '$lib/internal/helpers/index.js';
import type { InteractOutsideEvent } from '../interact-outside/types.js';
import { useEscapeKeydown, useInteractOutside } from '..';
import type { ModalConfig } from './types.js';

const visibleModals: Element[] = [];

export function useModal(node: HTMLElement, config: ModalConfig) {
	let unsubEscapeKeydown = noop;
	let unsubInteractOutside = noop;

	function removeNodeFromVisibleModals() {
		const index = visibleModals.indexOf(node);
		if (index >= 0) {
			visibleModals.splice(index, 1);
		}
	}

	function update(config: ModalConfig) {
		const {
			open,
			onClose,
			shouldCloseOnEscapeKeydown,
			shouldCloseOnInteractOutside,
			closeOnInteractOutside,
			closeOnEscapeKeydown,
		} = config;

		sleep(100).then(() => {
			if (open) {
				visibleModals.push(node);
			} else {
				removeNodeFromVisibleModals();
			}
		});

		function isLastModal() {
			return last(visibleModals) === node;
		}

		function closeModal() {
			// we only want to call onClose if this is the topmost modal
			if (isLastModal() && onClose) {
				onClose();
			}
		}

		function onInteractOutsideStart(e: InteractOutsideEvent) {
			const target = e.target;
			if (!isElement(target)) return;
			if (target && isLastModal()) {
				e.stopPropagation();
				e.preventDefault();
			}
		}

		function onInteractOutside(e: InteractOutsideEvent) {
			if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
				e.stopPropagation();
				e.preventDefault();
				closeModal();
			}
		}

		function onEscapeKeydown(e: KeyboardEvent) {
			if (e.key === kbd.ESCAPE && shouldCloseOnEscapeKeydown?.(e)) {
				e.stopPropagation();
				e.preventDefault();
				closeModal();
			}
		}

		unsubInteractOutside = useInteractOutside(node, {
			onInteractOutsideStart,
			onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
			enabled: open,
		}).destroy;

		unsubEscapeKeydown = useEscapeKeydown(node, {
			enabled: true,
			handler: closeOnEscapeKeydown ? onEscapeKeydown : undefined,
		}).destroy;
	}

	update(config);

	return {
		update,
		destroy() {
			removeNodeFromVisibleModals();
			unsubEscapeKeydown();
			unsubInteractOutside();
		},
	};
}
