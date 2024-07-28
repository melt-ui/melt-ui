import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createSlider } from './create.js';
export type { SliderComponentEvents } from './events.js';

export type SliderOrientation = 'horizontal' | 'vertical';

export type CreateSliderProps = {
	/**
	 * The uncontrolled default value of the slider.
	 *
	 * @default []
	 */
	defaultValue?: number[] | undefined;

	/**
	 * The controlled value store for the switch.
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<number[]> | undefined;

	/**
	 * The callback invoked when the value store of the slider changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<number[]> | undefined;

	/**
	 * The callback invoked when the user has committed the value of the slider.
	 */
	onValueCommitted?: ((value: number[]) => void) | undefined;

	/**
	 * The minimum value of the slider.
	 *
	 * @default 0
	 */
	min?: number | undefined;

	/**
	 * The maximum value of the slider.
	 *
	 * @default 100
	 */
	max?: number | undefined;

	/**
	 * The amount to increment or decrement the value of the slider.
	 *
	 * @default 1
	 */
	step?: number | undefined;

	/**
	 * The orientation of the slider.
	 *
	 * @default 'horizontal'
	 */
	orientation?: SliderOrientation | undefined;

	/**
	 * The direction of the slider.
	 *
	 * For vertical sliders, setting `dir` to `rtl`
	 * will cause the slider to be start from the top.
	 *
	 * @default 'ltr'
	 */
	dir?: 'ltr' | 'rtl' | undefined;

	/**
	 * When `true`, prevents the user from interacting with the slider.
	 *
	 * @default false
	 */
	disabled?: boolean | undefined;

	/**
	 * When `false`, disables automatically sorting the value array when moving thumbs past each other.
	 *
	 * @default true
	 */
	autoSort?: boolean | undefined;
};

export type Slider = BuilderReturn<typeof createSlider>;
export type SliderElements = Slider['elements'];
export type SliderOptions = Slider['options'];
export type SliderStates = Slider['states'];
