import type { BuilderReturn } from '$lib/internal/types';
import type { createPinInput } from './create';

export type CreatePinInputProps = {
	placeholder?: string;
	value?: string[];
	name?: string;
	disabled?: boolean;
	type?: string;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
