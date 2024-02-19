import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { createToggleGroup } from './create.js';
export type { ToggleGroupComponentEvents } from './events.js';
export type ToggleGroupType = 'single' | 'multiple';

export type CreateToggleGroupProps<T extends ToggleGroupType = 'single'> = {
	value?: ReadableProp<T extends 'single' ? string : string[]>;
	type?: ReadableProp<T>;
	disabled?: ReadableProp<boolean>;
	rovingFocus?: ReadableProp<boolean>;
	loop?: ReadableProp<boolean>;
	orientation?: ReadableProp<Orientation>;
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
