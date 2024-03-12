import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createSwitch } from './create.js';
export type { SwitchComponentEvents } from './events.js';
export type CreateSwitchProps = {
	/**
	 * The uncontrolled default checked status of the switch.
	 *
	 * @default false
	 */
	checked?: ReadableProp<boolean>;

	/**
	 * When `true`, prevents the user from interacting with the switch.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * When `true`, indicates that the user must check the switch before the owning form can be submitted.
	 * @default false
	 */
	required?: ReadableProp<boolean>;

	/**
	 * The name of the switch. Submitted with its owning form as part of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: ReadableProp<string>;

	/**
	 * The value given as data when submitted with a `name`.
	 * @default undefined
	 */
	value?: ReadableProp<string>;
};

export type Switch = BuilderReturn<typeof createSwitch>;
export type SwitchElements = Switch['elements'];
export type SwitchOptions = Switch['options'];
export type SwitchStates = Switch['states'];
