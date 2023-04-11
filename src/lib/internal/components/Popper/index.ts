import Anchor from './anchor.svelte';
import Arrow from './arrow.svelte';
import Content from './content.svelte';
import Root from './root.svelte';

export type { PopperRootProps } from './root.svelte';
export type { PopperAnchorProps } from './anchor.svelte';
export type { PopperArrowProps } from './arrow.svelte';
export type { PopperContentProps } from './content.svelte';

export const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
export const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];

export const Popper = {
	Root,
	Anchor,
	Arrow,
	Content
};
