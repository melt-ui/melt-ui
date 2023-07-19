import type { BuilderReturn, Orientation } from '$lib/internal/types';
import type { createRadioGroup } from './create';

export type CreateRadioGroupProps = {
	disabled?: boolean;
	loop?: boolean;
	orientation?: Orientation;
	value?: string;
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
