import type { createCollapsible } from './create';

export type CreateCollapsibleArgs = {
	open?: boolean;
	disabled?: boolean;
};

export type CreateCollapsibleReturn = ReturnType<typeof createCollapsible>;
