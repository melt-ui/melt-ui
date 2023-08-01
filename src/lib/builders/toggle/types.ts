import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createToggle } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateToggleProps = {
	disabled?: boolean;
	defaultPressed?: boolean;
	pressed?: Writable<boolean>;
	onPressedChange?: ChangeFn<boolean>;
};

export type Toggle = BuilderReturn<typeof createToggle>;
export type ToggleElements = Toggle['elements'];
export type ToggleOptions = Toggle['options'];
export type ToggleBuilders = Toggle['states'];
