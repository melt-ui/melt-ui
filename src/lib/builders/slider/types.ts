import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createSlider } from './create.js';
export type { SliderComponentEvents } from './events.js';

export type SliderOrientation = 'horizontal' | 'vertical';

export type CreateSliderProps = {
	/**
	 * The uncontrolled default value of the slider.
	 *
	 * @default []
	 */
	value?: ReadableProp<number[]>;

	/**
	 * The minimum value of the slider.
	 *
	 * @default 0
	 */
	min?: ReadableProp<number>;

	/**
	 * The maximum value of the slider.
	 *
	 * @default 100
	 */
	max?: ReadableProp<number>;

	/**
	 * The amount to increment or decrement the value of the slider.
	 *
	 * @default 1
	 */
	step?: ReadableProp<number>;

	/**
	 * The orientation of the slider.
	 *
	 * @default 'horizontal'
	 */
	orientation?: ReadableProp<SliderOrientation>;

	/**
	 * The direction of the slider.
	 *
	 * For vertical sliders, setting `dir` to `rtl`
	 * will cause the slider to be start from the top.
	 *
	 * @default 'ltr'
	 */
	dir?: ReadableProp<'ltr' | 'rtl'>;

	/**
	 * When `true`, prevents the user from interacting with the slider.
	 *
	 * @default false
	 */
	disabled?: ReadableProp<boolean>;
};

export type Slider = BuilderReturn<typeof createSlider>;
export type SliderElements = Slider['elements'];
export type SliderOptions = Slider['options'];
export type SliderStates = Slider['states'];
