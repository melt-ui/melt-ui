import type { InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { Writable } from 'svelte/store';

export type ModalConfig = {
	/**
	 * The open state of the modal.
	 */
	open: Writable<boolean>;

	/**
	 * Handler called when the overlay closes.
	 */
	onClose?: () => void;

	/**
	 * Whether the modal is able to be closed by interacting outside of it.
	 * If true, the `onClose` callback will be called when the user interacts
	 * outside of the modal.
	 *
	 * We pass a store here to handle the `effect` function inside the action.
	 *
	 * @default true
	 */
	closeOnInteractOutside: Writable<boolean>;

	/**
	 * If `closeOnInteractOutside` is `true` and this function is provided,
	 * it will be called with the element that the outside interaction occurred
	 * on. Whatever is returned from this function will determine whether the
	 * modal actually closes or not.
	 *
	 * This is useful to filter out interactions with certain elements from
	 * closing the modal. If `closeOnInteractOutside` is `false`, this function
	 * will not be called.
	 */
	shouldCloseOnInteractOutside?: (event: InteractOutsideEvent) => boolean;
};

export type ModalUpdateConfig = Omit<ModalConfig, 'open' | 'closeOnInteractOutside'> & {
	open: boolean;
	closeOnInteractOutside: boolean;
};
