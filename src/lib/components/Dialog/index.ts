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
import Overlay from './overlay.svelte';
export type { DialogOverlayProps } from './overlay.svelte';
import Title from './title.svelte';
export type { DialogTitleProps } from './title.svelte';
import Description from './description.svelte';
export type { DialogDescriptionProps } from './description.svelte';

export const Dialog = {
	Root,
	Portal,
	Trigger,
	Content,
	Close,
	Overlay,
	Title,
	Description,
};
