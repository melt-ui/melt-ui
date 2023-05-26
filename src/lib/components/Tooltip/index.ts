import Provider from './provider.svelte';
export { type TooltipProviderProps } from './provider.svelte';
import Root from './root.svelte';
export type { TooltipRootProps } from './root.svelte';
import Trigger from './trigger.svelte';
export type { TooltipTriggerProps } from './trigger.svelte';
import Portal from './portal.svelte';
export type { TooltipPortalProps } from './portal.svelte';
import Content from './content.svelte';
export type { TooltipContentProps } from './content.svelte';
import Arrow from '$lib/internal/components/Popper/arrow.svelte';

export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Portal,
	Content,
	Arrow,
};
