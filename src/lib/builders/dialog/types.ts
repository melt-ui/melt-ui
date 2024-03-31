import type { ChangeFn, FocusProp, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { DialogIdParts, createDialog } from './create.js';
export type { DialogComponentEvents } from './events.js';
export type CreateDialogProps = {
	/**
	 * If true, the dialog will prevent scrolling on the body
	 * when it is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * If true, the dialog will close when the user presses the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * If true, the dialog will close when the user clicks outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean | null;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: PointerEvent | MouseEvent | TouchEvent) => void;

	/**
	 * The `role` attribute to apply to the dialog.
	 *
	 * @default 'dialog'
	 */
	role?: 'dialog' | 'alertdialog';

	/**
	 * If true, the dialog will be open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * A writable store that controls the open state of the dialog.
	 * @see [Controlled Usage](https://melt-ui.com/docs/controlled#bring-your-own-store)
	 */
	open?: Writable<boolean>;

	/**
	 * A function that will be called when the open state of the dialog changes.
	 * @see [Controlled Usage](https://melt-ui.com/docs/controlled#change-functions)
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * If not undefined, the dialog content will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * If true, the dialog will be visible regardless of the open state.
	 * Use this when you want to conditionally render the content of the dialog
	 * using an `{#if ...}` block.
	 *
	 * @default false
	 */
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
	ids?: Partial<IdObj<DialogIdParts>>;
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = Dialog['elements'];
export type DialogOptions = Dialog['options'];
export type DialogStates = Dialog['states'];
