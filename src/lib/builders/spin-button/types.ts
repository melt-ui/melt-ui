import type { ChangeFn } from '$lib/internal/helpers/overridable.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createSpinButton } from './create.js';

export type CreateSpinButtonProps = {
	/**
	 * The uncontrolled default value of the spin button.
	 *
	 * @default 0
	 */
	defaultValue?: number;

	/**
	 * The controlled value store for the spin button.
	 *
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<number>;

	/**
	 * The callback invoked when the value store of the spin button changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<number>;

	/**
	 * The minimum value of the spin button.
	 */
	min?: number;

	/**
	 * The maximum value of the spin button.
	 */
	max?: number;

	/**
	 * The amount to increment or decrement by.
	 *
	 * @default 1
	 */
	step?: number;

	/**
	 * Whether or not the spin button should loop back to `min`
	 * when `max` is reached, and vice versa.
	 *
	 * @default false
	 */
	loop?: boolean;

	/**
	 * Whether or not the spin button is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;
};

export type SpinButton = BuilderReturn<typeof createSpinButton>;
export type SpinButtonElements = SpinButton['elements'];
export type SpinButtonStates = SpinButton['states'];
export type SpinButtonOptions = SpinButton['options'];
export type SpinButtonHelpers = SpinButton['helpers'];
