import type { ChangeFn } from '$lib/internal/helpers';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createPinInput } from './create';

export type CreatePinInputProps = {
	placeholder?: string;
	defaultValue?: string[];
	value?: Writable<string[]>;
	onValueChange?: ChangeFn<string[]>;
	name?: string;
	disabled?: boolean;
	type?: string;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
