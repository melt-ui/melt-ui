import type { FloatingConfig, FocusTrapConfig } from '$lib/internal/actions/index.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createPopover } from './create.js';
import type { BuilderReturn, IdObj } from '$lib/internal/types.js';
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
	 * Whether or not to close the popover when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

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
	 * Options used to configure the focus trap behaviour.
	 *
	 * @see https://github.com/focus-trap/focus-trap#createoptions
	 */
	focusTrap?: FocusTrapConfig;

	/**
	 * Override any of the element IDs set by the builder.
	 *
	 * NOTE: you should only use this prop if you know what
	 * you're doing, as it could break the out-of-the-box
	 * accessibility and functionality of the date field if
	 * implemented incorrectly.
	 */
	ids?: Partial<PopoverIds>;
};

export type PopoverIds = IdObj<'trigger' | 'content'>;
export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
