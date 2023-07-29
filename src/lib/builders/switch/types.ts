import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createSwitch } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateSwitchProps = {
	/** The uncontrolled default checked state of the switch. */
	defaultChecked?: boolean;
	/** The controlled checked state of the switch. */
	checked?: Writable<boolean>;
	/** The callback invoked when the checked state of the switch changes. */
	onCheckedChange?: ChangeFn<boolean>;
	/** When `true`, prevents the user from interacting with the switch. */
	disabled?: boolean;
	/** When `true`, indicates that the user must check the switch before the owning form can be submitted. */
	required?: boolean;
	/** The name of the switch. Submitted with its owning form as part of a name/value pair. */
	name?: string;
	/** The value given as data when submitted with a `name`. */
	value?: string;
};

export type Switch = BuilderReturn<typeof createSwitch>;
export type SwitchElements = Switch['elements'];
export type SwitchOptions = Switch['options'];
export type SwitchStates = Switch['states'];
export type SwitchHelpers = Switch['helpers'];
