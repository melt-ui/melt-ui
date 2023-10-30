import type { BuilderReturn, Expand } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { DialogIdParts, createDialog } from './create.js';
import type { ChangeFn, FocusProp, IdObj } from '$lib/internal/helpers/index.js';
export type { DialogComponentEvents } from './events.js';
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
	portal?: HTMLElement | string | null;

	forceVisible?: boolean;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on open.
	 */
	openFocus?: FocusProp;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on close.
	 */
	closeFocus?: FocusProp;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Expand<IdObj<DialogIdParts>>;
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = Dialog['elements'];
export type DialogOptions = Dialog['options'];
export type DialogStates = Dialog['states'];
