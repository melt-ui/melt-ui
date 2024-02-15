import type { ChangeFn } from '$lib/internal/helpers/overridable.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createStepper } from './create.js';

export type CreateStepperProps = {
	/**
	 * The uncontrolled default value of the stepper.
	 *
	 * @default 0
	 */
	defaultValue?: number;

	/**
	 * The controlled value store for the stepper.
	 *
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<number>;

	/**
	 * The callback invoked when the value store of the stepper changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<number>;

	/**
	 * The minimum value of the stepper.
	 */
	min?: number;

	/**
	 * The maximum value of the stepper.
	 */
	max?: number;

	/**
	 * The amount to increment or decrement by.
	 *
	 * @default 1
	 */
	step?: number;

	/**
	 * Whether or not the stepper should loop back to `min`
	 * when `max` is reached, and vice versa.
	 * 
	 * @default false
	 */
	loop?: boolean;

	/**
	 * Whether or not the stepper is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;
};

export type Stepper = BuilderReturn<typeof createStepper>;
export type StepperElements = Stepper['elements'];
export type StepperStates = Stepper['states'];
export type StepperOptions = Stepper['options'];
export type StepperHelpers = Stepper['helpers'];
