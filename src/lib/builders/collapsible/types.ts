import type { createCollapsible } from './create';
import type { BuilderReturn } from '$lib/internal/types';

export type CreateCollapsibleProps = {
	open?: boolean;
	disabled?: boolean;
};

export type Collapsible = BuilderReturn<typeof createCollapsible>;
export type CollapsibleElements = Collapsible['elements'];
export type CollapsibleOptions = Collapsible['options'];
export type CollapsibleStates = Collapsible['states'];
