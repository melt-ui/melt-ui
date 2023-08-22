import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createDialog } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { DialogComponentEvents } from './events.js';
export type CreateDialogProps = {
	/**
	 * Whether to prevent scrolling the body while the dialog is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * Whether to close the dialog when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether to close the dialog when the user clicks outside of the dialog.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * The role of the dialog.
	 *
	 * @default 'dialog'
	 */
	role?: 'dialog' | 'alertdialog';

	/**
	 * The default open state of the dialog.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * The controlled open state of the dialog.
	 *
	 */
	open?: Writable<boolean>;

	/**
	 * A change handler called when the open state of the dialog would normally change.
	 */
	onOpenChange?: ChangeFn<boolean>;
	/**
	 * If not undefined, the dialog content will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	forceVisible?: boolean;
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = Dialog['elements'];
export type DialogOptions = Dialog['options'];
export type DialogStates = Dialog['states'];
