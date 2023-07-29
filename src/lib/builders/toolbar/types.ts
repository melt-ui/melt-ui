import type { BuilderReturn, Orientation } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createToolbar } from './create';
import type { ChangeFn } from '@melt-ui/svelte/internal/helpers';

export type ToolbarGroupType = 'single' | 'multiple';

export type CreateToolbarProps = {
	loop?: boolean;
	orientation?: Orientation;
};

export type CreateToolbarGroupProps<T extends ToolbarGroupType = 'single'> = {
	defaultValue?: T extends 'single' ? string : string[];
	value?: Writable<string | string[] | undefined>;
	onValueChange?: ChangeFn<string | string[] | undefined>;
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
