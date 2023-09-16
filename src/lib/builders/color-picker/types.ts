
export type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

export type Orientation = 'horizontal' | 'vertical';

export type CreateColorPickerProps = {
    forceVisible?: boolean;

    /**
     * Which color is selected by default.
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