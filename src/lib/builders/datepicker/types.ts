import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { createDatePicker } from './create';

export interface _CreateDatePickerArgsBase {
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
	date: Date;
	startDate: Date;
	endDate: Date;
	dateList: Date[];
}

export interface _SingleArgs {
	type: 'single';
	value: Date;
}

export interface _RangeArgs {
	type: 'range';
	value: {
		start: Date;
		end: Date;
	};
}

export interface _MultipleArgs {
	type: 'multiple';
	value: Date[];
}

export type CreateDatePickerOptions = _CreateDatePickerArgsBase &
	(_SingleArgs | _RangeArgs | _MultipleArgs);
export type CreateDatePickerArgs = Partial<CreateDatePickerOptions>;

export interface DateArgs {
	value: Date;
	label: string;
	disabled?: boolean;
}

export type CreateDatePickerReturn = ReturnType<typeof createDatePicker>;
