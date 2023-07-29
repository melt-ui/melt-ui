import type { createCollapsible } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

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
	 * Whether the collapsible is open by default. This should only be used when
	 * you aren't passing an `open` store to this function, as it will override this value.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * Optionally pass a writable store to control the open state of the collapsible.
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
