import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createPinInput } from './create.js';
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
	 * The type of the input.
	 *
	 * @default 'text'
	 */
	type?: string;

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
};

export type PinInput = BuilderReturn<typeof createPinInput>;
export type PinInputElements = PinInput['elements'];
export type PinInputOptions = PinInput['options'];
export type PinInputStates = PinInput['states'];
export type PinInputHelpers = PinInput['helpers'];
