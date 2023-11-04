import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { SliderIdParts, createSlider } from './create.js';
export type { SliderComponentEvents } from './events.js';
export type CreateSliderProps = {
	/**
	 * The uncontrolled default value of the slider.
	 *
	 * @default []
	 */
	defaultValue?: number[];

	/**
	 * The controlled value store for the switch.
	 * If provided, this will override the value passed to `defaultValue`.
	 */
	value?: Writable<number[]>;

	/**
	 * The callback invoked when the value store of the slider changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<number[]>;

	/**
	 * The minimum value of the slider.
	 *
	 * @default 0
	 */
	min?: number;

	/**
	 * The maximum value of the slider.
	 *
	 * @default 100
	 */
	max?: number;

	/**
	 * The amount to increment or decrement the value of the slider.
	 *
	 * @default 1
	 */
	step?: number;

	/**
	 * The orientation of the slider.
	 *
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical';

	/**
	 * When `true`, prevents the user from interacting with the slider.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Optionally override the default ids we generate for the slider.
	 */
	ids?: IdObj<SliderIdParts>;
};

export type Slider = BuilderReturn<typeof createSlider>;
export type SliderElements = Slider['elements'];
export type SliderOptions = Slider['options'];
export type SliderStates = Slider['states'];
