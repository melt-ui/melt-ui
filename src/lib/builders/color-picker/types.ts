import type { createColorPicker } from "./create";

export type ColorPickerParts = 'color-canvas' | 'color-picker' | 'hue-slider' | 'hue-picker' | 'alpha-slider' | 'alpha-picker' | 'eye-dropper' | 'hex-input';

export type ColorRGB = {
    r: number;
    g: number;
    b: number;
    a?: number;
};

export type ReturnedColor = {
    rgb: ColorRGB;
    hex: string;
}

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

export type Orientation = 'horizontal' | 'vertical';

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

export interface Window {
    EyeDropper?: EyeDropperConstructor | undefined
}

export type ColorPicker = ReturnType<typeof createColorPicker>;
export type ColorPickerElements = ColorPicker['elements'];
export type ColorPickerStates = ColorPicker['states'];
export type ColorPickerHelpers = ColorPicker['helpers'];