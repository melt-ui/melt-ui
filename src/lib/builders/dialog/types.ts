import type { ChangeFn, FocusProp, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { DialogIdParts, createDialog } from './create.js';
import type { PortalConfig } from '$lib/internal/actions/portal.js';
import type { EscapeBehaviorType } from '$lib/internal/actions/index.js';
export type { DialogComponentEvents } from './events.js';
export type CreateDialogProps = {
	/**
	 * If true, the dialog will prevent scrolling on the body
	 * when it is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean | undefined;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	escapeBehavior?: EscapeBehaviorType | undefined;

	/**
	 * If true, the dialog will close when the user clicks outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean | undefined;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ((event: PointerEvent | MouseEvent | TouchEvent) => void) | undefined;

	/**
	 * The `role` attribute to apply to the dialog.
	 *
	 * @default 'dialog'
	 */
	role?: 'dialog' | 'alertdialog' | undefined;

	/**
	 * If true, the dialog will be open by default.
	 *
	 * @default false
	 */
	defaultOpen?: boolean | undefined;

	/**
	 * A writable store that controls the open state of the dialog.
	 * @see [Controlled Usage](https://melt-ui.com/docs/controlled#bring-your-own-store)
	 */
	open?: Writable<boolean> | undefined;

	/**
	 * A function that will be called when the open state of the dialog changes.
	 * @see [Controlled Usage](https://melt-ui.com/docs/controlled#change-functions)
	 */
	onOpenChange?: ChangeFn<boolean> | undefined;

	/**
	 * If not undefined, the dialog content will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: PortalConfig | null | undefined;

	/**
	 * If true, the dialog will be visible regardless of the open state.
	 * Use this when you want to conditionally render the content of the dialog
	 * using an `{#if ...}` block.
	 *
	 * @default false
	 */
	forceVisible?: boolean | undefined;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on open.
	 */
	openFocus?: FocusProp | undefined;

	/**
	 * Override the default autofocus behavior of the dialog
	 * on close.
	 */
	closeFocus?: FocusProp | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<DialogIdParts>> | undefined;
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = Dialog['elements'];
export type DialogOptions = Dialog['options'];
export type DialogStates = Dialog['states'];
