import type { BuilderReturn } from '$lib/internal/types';
import type { createSlider } from './create';

export type CreateSliderProps = {
	value: number[];
	min?: number;
	max?: number;
	step?: number;
	orientation?: 'horizontal' | 'vertical';
	disabled?: boolean;
};

export type Slider = BuilderReturn<typeof createSlider>;
export type SliderElements = Slider['elements'];
export type SliderOptions = Slider['options'];
export type SliderStates = Slider['states'];
