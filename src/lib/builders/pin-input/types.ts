import type { createPinInput } from './create';

export type CreatePinInputProps = {
	placeholder?: string;
	value?: string[];
	name?: string;
	disabled?: boolean;
	type?: string;
};

export type CreatePinInputReturn = ReturnType<typeof createPinInput>;
