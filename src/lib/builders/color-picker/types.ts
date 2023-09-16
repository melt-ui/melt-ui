
export type ColorRGB = {
    r: number;
    g: number;
    b: number;
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
};

export type NodeElement<T> = {
    node: T;
    height: number;
    width: number;
};

export type ColorPickerParts = 'trigger' | 'canvas' | 'picker' | 'hue' | 'hue-picker';