import type { createCheckbox } from './create';

type CheckedState = boolean | 'indeterminate';

export type CreateCheckboxArgs = {
	checked?: CheckedState;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	value?: string;
};

export type CreateCheckboxReturn = ReturnType<typeof createCheckbox>;
