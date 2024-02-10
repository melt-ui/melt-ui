import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createToggle } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { WritableProp } from '$lib/internal/helpers/props.js';
export type { ToggleComponentEvents } from './events.js';



export type CreateToggleProps = {
	disabled?: boolean;
	pressed?: WritableProp<boolean>;
};

export type Toggle = BuilderReturn<typeof createToggle>;
export type ToggleElements = Toggle['elements'];
export type ToggleOptions = Toggle['options'];
export type ToggleBuilders = Toggle['states'];
