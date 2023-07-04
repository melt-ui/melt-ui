import type { createPinInput } from './create';

export type CreatePinInputArgs = {
	placeholder?: string;
	value?: string[];
	name?: string;
	disabled?: boolean;
};

export type CreatePinInputReturn = ReturnType<typeof createPinInput>;
