import type { Orientation } from '$lib/internal/types';
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

export type CreateRadioGroupReturn = ReturnType<typeof createRadioGroup>;
