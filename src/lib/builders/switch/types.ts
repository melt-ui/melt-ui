import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createSwitch } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { SwitchComponentEvents } from './events.js';
export type CreateSwitchProps = {
	/**
	 * The uncontrolled default checked status of the switch.
	 *
	 * @default false
	 */
	defaultChecked?: boolean | undefined;

	/**
	 * The controlled checked state of the switch.
	 * If provided, this will override the value passed to `defaultChecked`.
	 */
	checked?: Writable<boolean> | undefined;

	/**
	 * The callback invoked when the checked state of the switch changes.
	 */
	onCheckedChange?: ChangeFn<boolean> | undefined;

	/**
	 * When `true`, prevents the user from interacting with the switch.
	 *
	 * @default false
	 */
	disabled?: boolean | undefined;

	/**
	 * When `true`, indicates that the user must check the switch before the owning form can be submitted.
	 * @default false
	 */
	required?: boolean | undefined;

	/**
	 * The name of the switch. Submitted with its owning form as part of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: string | undefined;

	/**
	 * The value given as data when submitted with a `name`.
	 * @default undefined
	 */
	value?: string | undefined;
};

export type Switch = BuilderReturn<typeof createSwitch>;
export type SwitchElements = Switch['elements'];
export type SwitchOptions = Switch['options'];
export type SwitchStates = Switch['states'];
