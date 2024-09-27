import type {
	EscapeBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
	PortalConfig,
} from '$lib/internal/actions/index.js';
import type { ChangeFn, FocusProp, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { PopoverIdParts, createPopover } from './create.js';
export type { PopoverComponentEvents } from './events.js';

export type CreatePopoverProps = {
	/**
	 * The positioning configuration for the floating element.
	 */
	positioning?: FloatingConfig | undefined;

	/**
	 * The size of the optional arrow in pixels.
	 */
	arrowSize?: number | undefined;

	/**
	 * The initial state of the `open` store.
	 * Should only be used if the popover is uncontrolled.
	 */
	defaultOpen?: boolean | undefined;

	/**
	 * A store that controls the open state.
	 * Use when you want to directly control the popover.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean> | undefined;

	/**
	 * Optional function that runs whenever open should change.
	 * When present, will control state changes instead of the
	 * default behaviour.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean> | undefined;

	/**
	 * Whether or not to disable the focus trap when the popover is open.
	 *
	 * @default false
	 */
	disableFocusTrap?: boolean | undefined;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	escapeBehavior?: EscapeBehaviorType | undefined;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean | undefined;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ((event: InteractOutsideEvent) => void) | undefined;

	/**
	 * Whether should prevent text selection overflowing the element when the element is the top layer.
	 *
	 * @defaultValue `true`
	 */
	preventTextSelectionOverflow?: boolean | undefined;

	/**
	 * Whether or not to prevent scrolling when the popover is open.
	 *
	 * @default false
	 */
	preventScroll?: boolean | undefined;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: PortalConfig | null | undefined;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean | undefined;

	/**
	 * Override the default autofocus behavior of the popover
	 * on open.
	 */
	openFocus?: FocusProp | undefined;

	/**
	 * Override the default autofocus behavior of the popover
	 * on close.
	 */
	closeFocus?: FocusProp | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<PopoverIdParts>> | undefined;
};

export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
