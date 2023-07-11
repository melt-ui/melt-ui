import type { createDialog } from './create';

export type CreateDialogProps = {
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	role?: 'dialog' | 'alertdialog';
};

export type CreateDialogReturn = ReturnType<typeof createDialog>;
