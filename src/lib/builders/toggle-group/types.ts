import type { Orientation } from '$lib/internal/types';
import type { createToggleGroup } from './create';

type SingleToggleGroupRootArgs = {
	type?: 'single';
	value?: string | null;
};

type MultipleToggleGroupRootProps = {
	type: 'multiple';
	value?: string[];
};

export type CreateToggleGroupArgs = (SingleToggleGroupRootArgs | MultipleToggleGroupRootProps) & {
	disabled?: boolean;
	rovingFocus?: boolean;
	loop?: boolean;
	orientation?: Orientation;
};

export type CreateToggleGroupReturn = ReturnType<typeof createToggleGroup>;
