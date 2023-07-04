import type { createRadioGroup } from './create';

type Orientation = 'horizontal' | 'vertical';

export type CreateRadioGroupArgs = {
	disabled?: boolean;
	loop?: boolean;
	orientation?: Orientation;
	value?: string;
	required?: boolean;
};

export type CreateRadioGroupReturn = ReturnType<typeof createRadioGroup>;
