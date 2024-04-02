import type { InteractOutsideConfig, InteractOutsideEvent } from '$lib/internal/actions/index.js';

export type ModalConfig = {
	/**
	 * Handler called when the overlay closes.
	 */
	onClose?: () => void;

	/**
	 * Click outside behavior type.
	 * `close`: Closes the element immediately.
	 * `defer`: Delegates the action to the parent floating element.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an outside click.
	 *
	 * @defaultValue `close`
	 */
	clickOutsideBehavior?: InteractOutsideConfig['behaviorType'];

	/**
	 * If `clickOutsideBehavior` is `'close'` and this function is provided,
	 * it will be called with the element that the outside interaction occurred
	 * on. Whatever is returned from this function will determine whether the
	 * modal actually closes or not.
	 *
	 * This is useful to filter out interactions with certain elements from
	 * closing the modal. If `clickOutsideBehavior` is not `'close'`, this function
	 * will not be called.
	 */
	shouldCloseOnInteractOutside?: (event: InteractOutsideEvent) => boolean;
};
