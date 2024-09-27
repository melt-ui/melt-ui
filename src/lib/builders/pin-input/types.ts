import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { PinInputIdParts, createPinInput } from './create.js';
export type { PinInputComponentEvents } from './events.js';

export type CreatePinInputProps = {
	/**
	 * An optional placeholder to display when the input is empty.
	 *
	 * @default '○'
	 */
	placeholder?: string | undefined;

	/**
	 * The name of the input. Submitted with its owning form as part
	 * of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: string | undefined;

	/**
	 * If `true`, prevents the user from interacting with the input.
	 *
	 * @default false
	 */
	disabled?: boolean | undefined;

	/**
	 * The type of the input. Use `password` to mask the input.
	 *
	 * @default 'text'
	 */
	type?: 'text' | 'password' | undefined;

	/**
	 * The uncontrolled default value of the pin input.
	 *
	 * @default []
	 */
	defaultValue?: string[] | undefined;

	/**
	 * The controlled value store for the pin input.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<string[]> | undefined;

	/**
	 * The callback invoked when the value store of the pin input changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string[]> | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<PinInputIdParts>> | undefined;
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
