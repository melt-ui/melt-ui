import type { WritableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createToggle } from './create.js';
export type { ToggleComponentEvents } from './events.js';

export type CreateToggleProps = {
	disabled?: WritableProp<boolean>;
	pressed?: WritableProp<boolean>;
};

export type Toggle = BuilderReturn<typeof createToggle>;
export type ToggleElements = Toggle['elements'];
export type ToggleOptions = Toggle['options'];
export type ToggleBuilders = Toggle['states'];
