import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createSlider } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateSliderProps = {
	defaultValue: number[];
	value?: Writable<number[]>;
	onValueChange?: ChangeFn<number[]>;
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
