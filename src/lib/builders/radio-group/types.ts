import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { createRadioGroup } from './create.js';
export type { RadioGroupComponentEvents } from './events.js';

export type CreateRadioGroupProps = {
	/**
	 * When `true`, prevents the user from interacting with the radio group.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;

	/**
	 * When `true`, indicates that the user must select a radio button before
	 * the owning form can be submitted.
	 *
	 * @default false
	 */
	required?: ReadableProp<boolean>;

	/**
	 * Whether or not the radio group should loop around when the end
	 * is reached.
	 *
	 * @default false
	 */
	loop?: ReadableProp<boolean>;

	/**
	 * The orientation of the radio group.
	 *
	 * @default 'horizontal'
	 */
	orientation?: ReadableProp<Orientation>;

	/**
	 * The uncontrolled default value of the radio group.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<string>;
};

export type RadioGroupItemProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type RadioGroup = BuilderReturn<typeof createRadioGroup>;
export type RadioGroupElements = RadioGroup['elements'];
export type RadioGroupOptions = RadioGroup['options'];
export type RadioGroupStates = RadioGroup['states'];
export type RadioGroupHelpers = RadioGroup['helpers'];
