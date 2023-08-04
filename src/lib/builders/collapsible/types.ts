import type { createCollapsible } from './create.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers/index.js';

export type CreateCollapsibleProps = {
	/**
	 * Whether the collapsible is disabled which prevents it from being opened.
	 */
	disabled?: boolean;

	/**
	 * Whether the collapsible content should be displayed even if it is not open.
	 * This is useful for animating the collapsible content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * Whether the collapsible is open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * Optionally pass a writable store to control the open state of the collapsible.
	 * If provided, this will override the value of the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean>;

	/**
	 * A callback called when the value of the `open` store should be changed.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;
};

export type Collapsible = BuilderReturn<typeof createCollapsible>;
export type CollapsibleElements = Collapsible['elements'];
export type CollapsibleOptions = Collapsible['options'];
export type CollapsibleStates = Collapsible['states'];
