import type { FloatingConfig } from '$lib/internal/actions';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createHoverCard } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

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
	 * Whether the element should be portaled to the body or not.
	 * If an element's parent is being portaled to the body, any child elements will
	 * automatically be portaled into that element.
	 *
	 * @default true
	 */
	portal?: boolean;
};

export type HoverCard = BuilderReturn<typeof createHoverCard>;
export type HoverCardElements = HoverCard['elements'];
export type HoverCardOptions = HoverCard['options'];
export type HoverCardStates = HoverCard['states'];
