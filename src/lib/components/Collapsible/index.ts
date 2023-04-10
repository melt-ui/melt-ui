import Content from './content.svelte';
import Root from './root.svelte';
import Trigger from './trigger.svelte';

export type { CollapsibleContentProps } from './content.svelte';
export type { CollapsibleRootProps } from './root.svelte';

export const Collapsible = {
	Content,
	Trigger,
	Root,
};
