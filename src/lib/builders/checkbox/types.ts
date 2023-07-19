import type { createCheckbox } from './create';
import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';

type CheckedState = boolean | 'indeterminate';

export type CreateCheckboxProps = {
	checked?: CheckedState;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
};

export type Checkbox = BuilderReturn<typeof createCheckbox>;

export type CheckboxElements = BuilderElements<Checkbox>;
export type CheckboxOptions = BuilderOptions<Checkbox>;
export type CheckboxStates = BuilderStates<Checkbox>;
export type CheckboxHelpers = BuilderHelpers<Checkbox>;
