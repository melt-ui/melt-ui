import type { createToolbar } from './create';

export type CreateToolbarArgs = {
	loop?: boolean;
	orientation?: 'horizontal' | 'vertical';
};

type SingleToolbarGroupRootArgs = {
	type?: 'single';
	value?: string | null;
};

type MultipleToolbarGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToolbarGroupArgs = (
	| SingleToolbarGroupRootArgs
	| MultipleToolbarGroupRootProps
) & {
	disabled?: boolean;
};

export type CreateToolbarReturn = ReturnType<typeof createToolbar>;
