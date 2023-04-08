import Root from './root.svelte';
export type { DialogRootProps } from './root.svelte';
import Portal from './portal.svelte';
export type { DialogPortalProps } from './portal.svelte';
import Trigger from './trigger.svelte';
export type { DialogTriggerProps } from './trigger.svelte';
import Content from './content.svelte';
export type { DialogContentProps } from './content.svelte';
import Close from './close.svelte';
export type { DialogCloseProps } from './close.svelte';

export const Dialog = {
	Root,
	Portal,
	Trigger,
	Content,
	Close
};
