import type { createCollapsible } from './create';

export type CreateCollapsibleProps = {
	open?: boolean;
	disabled?: boolean;
};

export type CreateCollapsibleReturn = ReturnType<typeof createCollapsible>;
