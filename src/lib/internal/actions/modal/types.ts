import type { InteractOutsideEvent } from '$lib/internal/actions/index.js';

export type ModalConfig = {
	/**
	 * Whether the modal is currently open.
	 */
	open?: boolean;

	/**
	 * Handler called when the overlay closes.
	 */
	onClose?: () => void;
	/**
	 * Whether the modal is able to be closed by interacting outside of it.
	 * If true, the `onClose` callback will be called when the user interacts
	 * outside of the modal.
	 *
	 * @default true
	 */
	closeOnInteractOutside?: boolean;

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
