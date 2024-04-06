import type {
	ClickOutsideBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
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
	positioning?: FloatingConfig;

	/**
	 * The size of the optional arrow in pixels.
	 */
	arrowSize?: number;

	/**
	 * The initial state of the `open` store.
	 * Should only be used if the popover is uncontrolled.
	 */
	defaultOpen?: boolean;

	/**
	 * A store that controls the open state.
	 * Use when you want to directly control the popover.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean>;

	/**
	 * Optional function that runs whenever open should change.
	 * When present, will control state changes instead of the
	 * default behaviour.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * Whether or not to disable the focus trap when the popover is open.
	 *
	 * @default false
	 */
	disableFocusTrap?: boolean;

	/**
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Click outside behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an outside click.
	 *
	 * @defaultValue `close`
	 */
	clickOutsideBehavior?: ClickOutsideBehaviorType;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: InteractOutsideEvent) => void;

	/**
	 * Whether or not to prevent scrolling when the popover is open.
	 *
	 * @default false
	 */
	preventScroll?: boolean;

	/**
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * Override the default autofocus behavior of the popover
	 * on open.
	 */
	openFocus?: FocusProp;

	/**
	 * Override the default autofocus behavior of the popover
	 * on close.
	 */
	closeFocus?: FocusProp;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<PopoverIdParts>>;
};

export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
