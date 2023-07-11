import type { createCheckbox } from './create';

type CheckedState = boolean | 'indeterminate';

export type CreateCheckboxProps = {
	checked?: CheckedState;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
};

export type CreateCheckboxReturn = ReturnType<typeof createCheckbox>;
