import Root from './root.svelte';
import Item from './item.svelte';
import Header from './header.svelte';
import Content from './content.svelte';
import Trigger from './trigger.svelte';

export type { AccordionRootProps } from './root.svelte';
export type { AccordionItemProps } from './item.svelte';
export type { AccordionHeaderProps } from './header.svelte';
export type { AccordionContentProps } from './content.svelte';
export type { AccordionTriggerProps } from './trigger.svelte';

export const Accordion = {
	Root,
	Item,
	Header,
	Content,
	Trigger
};
