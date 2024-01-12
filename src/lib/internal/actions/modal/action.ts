import { effect, isElement, last, noop, sleep } from '$lib/internal/helpers/index.js';
import type { InteractOutsideEvent } from '../interact-outside/types.js';
import { useInteractOutside } from '..';
import type { ModalConfig } from './types.js';

const visibleModals: Element[] = [];

type ModalUpdateConfig = Omit<ModalConfig, 'open' | 'closeOnInteractOutside'> & {
	open: boolean;
	closeOnInteractOutside: boolean;
};

export function useModal(node: HTMLElement, config: ModalConfig) {
	let unsubInteractOutside = noop;

	function removeNodeFromVisibleModals() {
		const index = visibleModals.indexOf(node);
		if (index >= 0) {
			visibleModals.splice(index, 1);
		}
	}

	function update(config: ModalUpdateConfig) {
		const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config;

		sleep(1).then(() => {
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

		unsubInteractOutside = useInteractOutside(node, {
			onInteractOutsideStart,
			onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
			enabled: open,
		}).destroy;
	}

	effect([config.closeOnInteractOutside, config.open], ([$closeOnOutsideClick, $open]) => {
		update({ ...config, open: $open, closeOnInteractOutside: $closeOnOutsideClick });
	});

	return {
		update,
		destroy() {
			removeNodeFromVisibleModals();
			unsubInteractOutside();
		},
	};
}
