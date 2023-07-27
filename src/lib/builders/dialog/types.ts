import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createDialog } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateDialogProps = {
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	role?: 'dialog' | 'alertdialog';
	defaultOpen?: boolean;
	open?: Writable<boolean>;
	onOpenChange?: ChangeFn<boolean>;
	/**
	 * If not undefined, the dialog content will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string;
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = Dialog['elements'];
export type DialogOptions = Dialog['options'];
export type DialogStates = Dialog['states'];
