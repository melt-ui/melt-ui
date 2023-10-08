import type { ColorHSL, ColorHSV, ColorRGB, Orientation } from "$lib/internal/types";
import type { createColorPicker } from "./create";

export type ColorPickerParts = 'color-canvas' | 'color-picker' | 'hue-slider' | 'hue-picker' | 'alpha-slider' | 'alpha-picker' | 'eye-dropper' | 'hex-input';


export type CreateColorPickerProps = {
    forceVisible?: boolean;

    /**
     * Which color is selected by default.
     * Should be a hex value: #4242ff.
     */
    defaultColor?: string;

    /**
     * The orientation of the hue slider.
     */
    hueSliderOrientation?: Orientation;

    /**
     * The orientation of the alpha slider.
     */
    alphaSliderOrientation?: Orientation;
};

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
}

export interface ColorSelectionOptions {
    signal?: AbortSignal
}

export interface ColorSelectionResult {
    sRGBHex: string
}

export interface EyeDropperType {
    open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>
}

export interface EyeDropperConstructor {
    new (): EyeDropperType
}

export interface EyeDropperWindow {
    EyeDropper?: EyeDropperConstructor | undefined
}

export type ColorPicker = ReturnType<typeof createColorPicker>;
export type ColorPickerElements = ColorPicker['elements'];
export type ColorPickerStates = ColorPicker['states'];
export type ColorPickerHelpers = ColorPicker['helpers'];