import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createToggleGroup } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { ToggleGroupComponentEvents } from './events.js';
export type ToggleGroupType = 'single' | 'multiple';

export type CreateToggleGroupProps<T extends ToggleGroupType = 'single'> = {
	defaultValue?: T extends 'single' ? string : string[];
	value?: Writable<string | string[] | undefined>;
	onValueChange?: ChangeFn<string | string[] | undefined>;
	type?: T;
	disabled?: boolean;
	rovingFocus?: boolean;
	loop?: boolean;
	orientation?: Orientation;
};

export type ToggleGroupItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type ToggleGroup<T extends ToggleGroupType = 'single'> = BuilderReturn<
	typeof createToggleGroup<T>
>;
export type ToggleGroupElements<T extends ToggleGroupType = 'single'> = BuilderReturn<
	typeof createToggleGroup<T>
>['elements'];
export type ToggleGroupOptions<T extends ToggleGroupType = 'single'> = BuilderReturn<
	typeof createToggleGroup<T>
>['options'];
export type ToggleGroupStates<T extends ToggleGroupType = 'single'> = BuilderReturn<
	typeof createToggleGroup<T>
>['states'];
export type ToggleGroupHelpers<T extends ToggleGroupType = 'single'> = BuilderReturn<
	typeof createToggleGroup<T>
>['helpers'];
