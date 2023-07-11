import type { createSlider } from './create';

export type CreateSliderProps = {
	value: number[];
	min?: number;
	max?: number;
	step?: number;
	orientation?: 'horizontal' | 'vertical';
	disabled?: boolean;
};

export type CreateSliderReturn = ReturnType<typeof createSlider>;
