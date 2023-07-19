import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createSwitch } from './create';

export type CreateSwitchProps = {
	/** The controlled checked state of the switch. */
	checked?: boolean;
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
export type SwitchElements = BuilderElements<Switch>;
export type SwitchOptions = BuilderOptions<Switch>;
export type SwitchStates = BuilderStates<Switch>;
export type SwitchHelpers = BuilderHelpers<Switch>;
