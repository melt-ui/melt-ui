import type { createCheckbox } from './create';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateCheckboxProps = {
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
	checked?: Writable<boolean | 'indeterminate'>;
	defaultChecked?: boolean | 'indeterminate';
	onCheckedChange?: ChangeFn<boolean | 'indeterminate'>;
};

export type Checkbox = BuilderReturn<typeof createCheckbox>;

export type CheckboxElements = Checkbox['elements'];
export type CheckboxOptions = Checkbox['options'];
export type CheckboxStates = Checkbox['states'];
export type CheckboxHelpers = Checkbox['helpers'];
