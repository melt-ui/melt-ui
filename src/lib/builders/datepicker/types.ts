import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { createDatePicker } from './create';

export interface CreateDatePickerOptions {
	preventScroll: boolean;
	closeOnEscape: boolean;
	closeOnOutsideClick: boolean;
	open: boolean;
	arrowSize: number;
	positioning: FloatingConfig;
	earliest: Date | null;
	latest: Date | null;
	autoSelect: boolean;
	disabled: boolean;
	autoClose: boolean;
	value: Date[];
	type: 'single' | 'range' | 'multiple';
	activeDate: Date;
}

export type CreateDatePickerArgs = Partial<CreateDatePickerOptions>;

export interface DateArgs {
	value: Date;
	label: string;
	disabled?: boolean;
}

export type CreateDatePickerReturn = ReturnType<typeof createDatePicker>;
