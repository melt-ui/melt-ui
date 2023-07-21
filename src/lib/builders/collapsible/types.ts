import type { createCollapsible } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateCollapsibleProps = {
	defaultOpen?: boolean;
	open?: Writable<boolean>;
	disabled?: boolean;
	onOpenChange?: ChangeFn<boolean>;
};

export type Collapsible = BuilderReturn<typeof createCollapsible>;
export type CollapsibleElements = Collapsible['elements'];
export type CollapsibleOptions = Collapsible['options'];
export type CollapsibleStates = Collapsible['states'];
