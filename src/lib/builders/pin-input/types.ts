import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn, Expand } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { PinInputIdParts, createPinInput } from './create.js';
export type { PinInputComponentEvents } from './events.js';

export type CreatePinInputProps = {
	/**
	 * An optional placeholder to display when the input is empty.
	 *
	 * @default '○'
	 */
	placeholder?: string;

	/**
	 * The name of the input. Submitted with its owning form as part
	 * of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: string;

	/**
	 * If `true`, prevents the user from interacting with the input.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * The type of the input. Use `password` to mask the input.
	 *
	 * @default 'text'
	 */
	type?: 'text' | 'password';

	/**
	 * The uncontrolled default value of the pin input.
	 *
	 * @default []
	 */
	defaultValue?: string[];

	/**
	 * The controlled value store for the pin input.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<string[]>;

	/**
	 * The callback invoked when the value store of the pin input changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string[]>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Expand<IdObj<PinInputIdParts>>;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
