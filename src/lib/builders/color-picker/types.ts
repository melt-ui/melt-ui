import type { ChangeFn } from '$lib/internal/helpers';

import type { Writable } from 'svelte/store';
import type { createColorPicker } from './create';
import type { Orientation } from '$lib/internal/types';

export type ColorRGB = {
	r: number;
	g: number;
	b: number;
	a?: number;
};

export type ColorHSL = {
	h: number;
	s: number;
	l: number;
};

export type ColorHSV = {
	h: number;
	s: number;
	v: number;
};

export type ColorPickerParts =
	| 'color-canvas'
	| 'color-picker'
	| 'hue-slider'
	| 'hue-picker'
	| 'alpha-slider'
	| 'alpha-picker'
	| 'channel-slider'
	| 'channel-slider-thumb'
	| 'channel-input'
	| 'eye-dropper'
	| 'input';

export type ArrowKeys = 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight';

export type KeyDurations = Record<ArrowKeys, number | null>;

export type NodeElement<T> = {
	node?: T;
	height: number;
	width: number;
};

export type NodeSize = {
	height: number;
	width: number;
};

export type Position = {
	x: number;
	y: number;
};

export type ReturnedColor = {
	rgb: ColorRGB;
	hsv: ColorHSV;
	hsl: ColorHSL;
};

export interface ColorSelectionOptions {
	signal?: AbortSignal;
}

export interface ColorSelectionResult {
	sRGBHex: string;
}

export interface EyeDropperType {
	open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

export interface EyeDropperConstructor {
	new (): EyeDropperType;
}

export interface EyeDropperWindow {
	EyeDropper?: EyeDropperConstructor | undefined;
}

export type CreateColorPickerProps = {
	/**
	 * The orientation of the hue slider.
	 */
	hueSliderOrientation?: Orientation;

	/**
	 * The orientation of the alpha slider.
	 */
	alphaSliderOrientation?: Orientation;

	/**
	 * Which color is selected by default.
	 * Supports hex, rgb, hsl and hsv values.
	 */
	defaultValue?: string;

	/**
	 * The controlled value store for the hex color value.
	 */
	value?: Writable<string>;

	/**
	 * The callback invoked when the value store of the color picker changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string>;

	/**
	 * The controlled value store for the hue angle.
	 * Should be a value between 0 and 360.
	 */
	hueAngle?: Writable<number>;

	/**
	 * The controlled value store for the alpha value.
	 * Should be a value between 0 and 100.
	 */
	alphaValue?: Writable<number>;
};

export type ColorPicker = ReturnType<typeof createColorPicker>;
export type ColorPickerElements = ColorPicker['elements'];
export type ColorPickerStates = ColorPicker['states'];
export type ColorPickerHelpers = ColorPicker['helpers'];
