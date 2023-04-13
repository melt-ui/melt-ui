import Root from './root.svelte';
export type { TabsRootProps } from './root.svelte';
import List from './list.svelte';
export type { TabsListProps } from './list.svelte';
import Trigger from './trigger.svelte';
export type { TabsTriggerProps } from './trigger.svelte';
import Content from './content.svelte';
export type { TabsContentProps } from './content.svelte';

export const Tabs = {
	Root,
	List,
	Trigger,
	Content,
};
