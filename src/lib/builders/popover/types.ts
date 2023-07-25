import type { FloatingConfig } from '$lib/internal/actions';
import type { ChangeFn } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';
import type { createPopover } from './create';
import type { BuilderReturn } from '$lib/internal/types';

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
	 */
	open?: Writable<boolean>;
	/**
	 * Optional function that runs whenever open should change.
	 * When present, will control state changes instead of the default behaviour
	 *
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
	 * Whether or not to portal the popover content to the body.
	 *
	 * @default true
	 */
	portal?: boolean;
};

export type Popover = BuilderReturn<typeof createPopover>;
export type PopoverElements = Popover['elements'];
export type PopoverOptions = Popover['options'];
export type PopoverStates = Popover['states'];
