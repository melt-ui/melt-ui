import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { createToggleGroup } from './create.js';
export type { ToggleGroupComponentEvents } from './events.js';
export type ToggleGroupType = 'single' | 'multiple';

export type CreateToggleGroupProps = {
	value?: ReadableProp<string[]>;
	type?: ReadableProp<ToggleGroupType>;
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

export type ToggleGroup = BuilderReturn<
	typeof createToggleGroup
>;
export type ToggleGroupElements = BuilderReturn<
	typeof createToggleGroup
>['elements'];
export type ToggleGroupOptions = BuilderReturn<
	typeof createToggleGroup
>['options'];
export type ToggleGroupStates = BuilderReturn<
	typeof createToggleGroup
>['states'];