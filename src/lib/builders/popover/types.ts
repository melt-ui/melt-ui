import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { FocusProp, IdObj } from '$lib/internal/helpers/index.js';
import type { WritableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { PopoverIdParts, createPopover } from './create.js';
export type { PopoverComponentEvents } from './events.js';

export type CreatePopoverProps = {
	/**
	 * The positioning configuration for the floating element.
	 */
	positioning?: WritableProp<FloatingConfig>;

	/**
	 * The size of the optional arrow in pixels.
	 */
	arrowSize?: WritableProp<number>;

	/**
	 * If the popover is open or not.
	 *
	 * @default false
	 */
	open?: WritableProp<boolean>;

	/**
	 * Whether or not to disable the focus trap when the popover is open.
	 *
	 * @default false
	 */
	disableFocusTrap?: WritableProp<boolean>;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: WritableProp<boolean>;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: WritableProp<boolean>;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: WritableProp<(event: PointerEvent) => void>;

	/**
	 * Whether or not to prevent scrolling when the popover is open.
	 *
	 * @default false
	 */
	preventScroll?: WritableProp<boolean>;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: WritableProp<HTMLElement | string | null>;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: WritableProp<boolean>;

	/**
	 * Override the default autofocus behavior of the popover
	 * on open.
	 */
	openFocus?: WritableProp<FocusProp>;

	/**
	 * Override the default autofocus behavior of the popover
	 * on close.
	 */
	closeFocus?: WritableProp<FocusProp>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<PopoverIdParts>>;
};

export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
