import Root from './root.svelte';
export type { AlertDialogRootProps } from './root.svelte';
import Trigger from './trigger.svelte';
export type { AlertDialogTriggerProps } from './trigger.svelte';
import Portal from './portal.svelte';
export type { AlertDialogPortalProps } from './portal.svelte';
import Overlay from './overlay.svelte';
export type { AlertDialogOverlayProps } from './overlay.svelte';
import Content from './content.svelte';
export type { AlertDialogContentProps } from './content.svelte';
import Cancel from './cancel.svelte';
export type { AlertDialogCancelProps } from './cancel.svelte';
import Action from './action.svelte';
export type { AlertDialogActionProps } from './action.svelte';
import Title from './title.svelte';
export type { AlertDialogTitleProps } from './title.svelte';
import Description from './description.svelte';
export type { AlertDialogDescriptionProps } from './description.svelte';

export const AlertDialog = {
	Root,
	Trigger,
	Portal,
	Overlay,
	Content,
	Cancel,
	Action,
	Title,
	Description,
};
