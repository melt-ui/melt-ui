import type { createCheckbox } from './create';
import type { BuilderReturn } from '$lib/internal/types';

type CheckedState = boolean | 'indeterminate';

export type CreateCheckboxProps = {
	checked?: CheckedState;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
};

export type Checkbox = BuilderReturn<typeof createCheckbox>;
export type CheckboxElements = Checkbox['elements'];
export type CheckboxOptions = Checkbox['options'];
export type CheckboxStates = Checkbox['states'];
export type CheckboxHelpers = Checkbox['helpers'];
