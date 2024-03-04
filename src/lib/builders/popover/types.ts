import type { FloatingConfig, InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { FocusProp, IdObjProp } from '$lib/internal/helpers/index.js';
import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { PopoverIdParts, createPopover } from './create.js';
export type { PopoverComponentEvents } from './events.js';

export type CreatePopoverProps = {
	/**
	 * The positioning configuration for the floating element.
	 */
	positioning?: ReadableProp<FloatingConfig>;

	/**
	 * The size of the optional arrow in pixels.
	 */
	arrowSize?: ReadableProp<number>;

	/**
	 * If the popover is open or not.
	 *
	 * @default false
	 */
	open?: ReadableProp<boolean>;

	/**
	 * Whether or not to disable the focus trap when the popover is open.
	 *
	 * @default false
	 */
	disableFocusTrap?: ReadableProp<boolean>;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: ReadableProp<boolean>;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: ReadableProp<boolean>;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ReadableProp<(event: InteractOutsideEvent) => void>;

	/**
	 * Whether or not to prevent scrolling when the popover is open.
	 *
	 * @default false
	 */
	preventScroll?: ReadableProp<boolean>;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<HTMLElement | string | null>;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * Override the default autofocus behavior of the popover
	 * on open.
	 */
	openFocus?: ReadableProp<FocusProp>;

	/**
	 * Override the default autofocus behavior of the popover
	 * on close.
	 */
	closeFocus?: ReadableProp<FocusProp>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: IdObjProp<PopoverIdParts>;
};

export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
