import type { Orientation } from '$lib/internal/types';
import type { createToggleGroup } from './create';

type SingleToggleGroupRootProps = {
	type?: 'single';
	value?: string | null;
};

type MultipleToggleGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToggleGroupProps = (SingleToggleGroupRootProps | MultipleToggleGroupRootProps) & {
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
