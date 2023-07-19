import type { BuilderReturn } from '$lib/internal/types';
import type { createToggle } from './create';

export type CreateToggleProps = {
	disabled?: boolean;
	pressed?: boolean;
};

export type Toggle = BuilderReturn<typeof createToggle>;
export type ToggleElements = Toggle['elements'];
export type ToggleOptions = Toggle['options'];
export type ToggleBuilders = Toggle['states'];
