import type { IdObj } from '$lib/internal/helpers/index.js';
import type { WritableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { PinInputIdParts, createPinInput } from './create.js';
export type { PinInputComponentEvents } from './events.js';

export type CreatePinInputProps = {
	/**
	 * An optional placeholder to display when the input is empty.
	 *
	 * @default '○'
	 */
	placeholder?: WritableProp<string>;

	/**
	 * The name of the input. Submitted with its owning form as part
	 * of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: WritableProp<string>;

	/**
	 * If `true`, prevents the user from interacting with the input.
	 *
	 * @default false
	 */
	disabled?: WritableProp<boolean>;

	/**
	 * The type of the input. Use `password` to mask the input.
	 *
	 * @default 'text'
	 */
	type?: WritableProp<'text' | 'password'>;

	/**
	 * The PinInput's value.
	 */
	value?: WritableProp<string[]>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<PinInputIdParts>>;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
