import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createHoverCard } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';

export type CreateHoverCardProps = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: FloatingConfig;

	/**
	 * Whether or not the hovercard is open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * A controlled open state store for the hovercard. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean>;

	/**
	 * A callback for when the open state changes
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * The delay in milliseconds to hover before opening the hovercard
	 *
	 * @default 700
	 */
	openDelay?: number;

	/**
	 * The delay in milliseconds after the pointer leaves the
	 * hovercard before closing it.
	 *
	 * @default 300
	 */
	closeDelay?: number;

	/**
	 * Whether or not to close the hovercard when the pointer is clicked
	 * outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether or not to close the hovercard when the escape key is pressed
	 * while it is open.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * The size of the optional arrow element in pixels
	 *
	 * @default 8
	 */
	arrowSize?: number;

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
	 * If not undefined, the popover will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string;
};

export type HoverCard = BuilderReturn<typeof createHoverCard>;
export type HoverCardElements = HoverCard['elements'];
export type HoverCardOptions = HoverCard['options'];
export type HoverCardStates = HoverCard['states'];
