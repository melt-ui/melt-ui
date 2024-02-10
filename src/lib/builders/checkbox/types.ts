import type { WritableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createCheckbox } from './create.js';
export type { CheckboxComponentEvents } from './events.js';

export type CreateCheckboxProps = {
	/**
	 * When `true`, the checkbox will be disabled.
	 *
	 * @default false
	 */
	disabled?: WritableProp<boolean>;

	/**
	 * When `true`, indicates that the user must check the checkbox before the owning form can be submitted.
	 *
	 * @default false;
	 */
	required?: WritableProp<boolean>;

	/**
	 * The name of the checkbox. Submitted with its owning form as part of a name/value pair.
	 *
	 * @default undefined
	 */
	name?: WritableProp<string>;

	/**
	 * The value given as data when submitted with a `name`.
	 *
	 * @default 'on'
	 */
	value?: WritableProp<string>;

	/**
	 * The checked state of the checkbox.
	 */
	checked?: WritableProp<boolean | 'indeterminate'>;
};

export type Checkbox = BuilderReturn<typeof createCheckbox>;

export type CheckboxElements = Checkbox['elements'];
export type CheckboxOptions = Checkbox['options'];
export type CheckboxStates = Checkbox['states'];
export type CheckboxHelpers = Checkbox['helpers'];
