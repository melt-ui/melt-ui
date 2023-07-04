import type { Orientation } from '$lib/internal/types';
import type { createRadioGroup } from './create';

export type CreateRadioGroupArgs = {
	disabled?: boolean;
	loop?: boolean;
	orientation?: Orientation;
	value?: string;
	required?: boolean;
};

export type CreateRadioGroupReturn = ReturnType<typeof createRadioGroup>;
