import type { createCollapsible } from './create';
import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';

export type CreateCollapsibleProps = {
	open?: boolean;
	disabled?: boolean;
};

export type Collapsible = BuilderReturn<typeof createCollapsible>;
export type CollapsibleElements = BuilderElements<Collapsible>;
export type CollapsibleOptions = BuilderOptions<Collapsible>;
export type CollapsibleStates = BuilderStates<Collapsible>;
