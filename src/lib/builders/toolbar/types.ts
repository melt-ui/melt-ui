import type { Orientation } from '$lib/internal/types';
import type { createToolbar } from './create';

export type ToolbarGroupType = 'single' | 'multiple';

export type CreateToolbarProps = {
	loop?: boolean;
	orientation?: Orientation;
};

export type CreateToolbarGroupProps<T extends ToolbarGroupType = 'single'> = {
	value?: T extends 'single' ? string : string[];
	type?: T;
	disabled?: boolean;
};

export type ToolbarGroupItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;
export type CreateToolbarReturn = ReturnType<typeof createToolbar>;
