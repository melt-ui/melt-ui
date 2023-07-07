import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { createDatePicker } from './create';

export interface _CreateDatePickerArgsBase {
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	open?: boolean;
	arrowSize?: number;
	positioning?: FloatingConfig;
}

export interface CreateDatePickerArgs extends _CreateDatePickerArgsBase {
	type?: 'date' | 'range';
	value?: Date;
	end?: Date;
	earliest?: Date | null;
	latest?: Date | null;
	disabled?: boolean;
}

export interface DateArgs {
	value: Date;
	label: string;
	disabled?: boolean;
}

export type CreateDatePickerReturn = ReturnType<typeof createDatePicker>;
