import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
	Orientation,
} from '$lib/internal/types';
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
export type RadioGroupElements = BuilderElements<RadioGroup>;
export type RadioGroupOptions = BuilderOptions<RadioGroup>;
export type RadioGroupStates = BuilderStates<RadioGroup>;
export type RadioGroupHelpers = BuilderHelpers<RadioGroup>;
