import type { BuilderReturn, Orientation } from '$lib/internal/types';
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

export type Toolbar = BuilderReturn<typeof createToolbar>;
export type ToolbarElements = Toolbar['elements'];
export type ToolbarOptions = Toolbar['options'];
export type ToolbarBuilders = Toolbar['builders'];

export type ToolbarGroup = BuilderReturn<ToolbarBuilders['createToolbarGroup']>;
export type ToolbarGroupElements = ToolbarGroup['elements'];
export type ToolbarGroupOptions = ToolbarGroup['options'];
export type ToolbarGroupStates = ToolbarGroup['states'];
export type ToolbarGroupHelpers = ToolbarGroup['helpers'];
