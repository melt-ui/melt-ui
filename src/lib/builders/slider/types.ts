import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
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
export type SliderElements = BuilderElements<Slider>;
export type SliderOptions = BuilderOptions<Slider>;
export type SliderStates = BuilderStates<Slider>;
