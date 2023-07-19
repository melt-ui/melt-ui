import type {
	BuilderActions,
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createDialog } from './create';

export type CreateDialogProps = {
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	role?: 'dialog' | 'alertdialog';
};

export type Dialog = BuilderReturn<typeof createDialog>;
export type DialogElements = BuilderElements<Dialog>;
export type DialogOptions = BuilderOptions<Dialog>;
export type DialogStates = BuilderStates<Dialog>;
export type DialogActions = BuilderActions<Dialog>;
