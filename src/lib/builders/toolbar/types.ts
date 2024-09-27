import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createToolbar } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { ToolbarComponentEvents } from './events.js';
export type ToolbarGroupType = 'single' | 'multiple';

export type CreateToolbarProps = {
	loop?: boolean | undefined;
	orientation?: Orientation | undefined;
};

export type CreateToolbarGroupProps<T extends ToolbarGroupType = 'single'> = {
	defaultValue?: (T extends 'single' ? string : string[]) | undefined;
	value?: Writable<string | string[] | undefined> | undefined;
	onValueChange?: ChangeFn<string | string[] | undefined> | undefined;
	type?: T | undefined;
	disabled?: boolean | undefined;
};

export type ToolbarGroupItemProps =
	| {
			value: string;
			disabled?: boolean | undefined;
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
