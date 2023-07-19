import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createPinInput } from './create';

export type CreatePinInputProps = {
	placeholder?: string;
	value?: string[];
	name?: string;
	disabled?: boolean;
	type?: string;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = BuilderElements<PinInput>;
export type PinInputOptions = BuilderOptions<PinInput>;
export type PinInputStates = BuilderStates<PinInput>;
export type PinInputHelpers = BuilderHelpers<PinInput>;
