import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createCollapsible } from './create.js';
export type { CollapsibleComponentEvents } from './events.js';

export type CreateCollapsibleProps = {
	/**
	 * Whether the collapsible is disabled which prevents it from being opened.
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * Whether the collapsible content should be displayed even if it is not open.
	 * This is useful for animating the collapsible content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	/**
	 * Whether the collapsible is open by default.
	 *
	 * @default false
	 */
	open?: ReadableProp<boolean>;
};

export type Collapsible = BuilderReturn<typeof createCollapsible>;
export type CollapsibleElements = Collapsible['elements'];
export type CollapsibleOptions = Collapsible['options'];
export type CollapsibleStates = Collapsible['states'];
