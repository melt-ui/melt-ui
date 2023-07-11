import type { createToolbar } from './create';

export type CreateToolbarProps = {
	loop?: boolean;
	orientation?: 'horizontal' | 'vertical';
};

type SingleToolbarGroupRootProps = {
	type?: 'single';
	value?: string | null;
};

type MultipleToolbarGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToolbarGroupProps = (
	| SingleToolbarGroupRootProps
	| MultipleToolbarGroupRootProps
) & {
	disabled?: boolean;
};

export type ToolbarGroupItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;
export type CreateToolbarReturn = ReturnType<typeof createToolbar>;
