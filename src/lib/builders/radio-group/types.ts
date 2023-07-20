import type { BuilderReturn, Orientation } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createRadioGroup } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateRadioGroupProps = {
	disabled?: boolean;
	loop?: boolean;
	orientation?: Orientation;
	defaultValue?: string;
	value?: Writable<string>;
	onValueChange?: ChangeFn<string>;
	required?: boolean;
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
