import type { Orientation } from '$lib/internal/types';
import type { createToggleGroup } from './create';

export type ToggleGroupType = 'single' | 'multiple';

export type CreateToggleGroupProps<T extends ToggleGroupType = 'single'> = {
	value?: T extends 'single' ? string : string[];
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

export type CreateToggleGroupReturn = ReturnType<typeof createToggleGroup>;
