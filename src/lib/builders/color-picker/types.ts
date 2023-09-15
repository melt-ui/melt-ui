
export type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

export type CreateColorPickerProps = {
    forceVisible?: boolean;

    /**
     * Which color is selected by default.
     */
    defaultColor?: string;
};

export type NodeElement<T> = {
    node: T;
    height: number;
    width: number;
};

export type ColorPickerParts = 'trigger' | 'canvas' | 'picker' | 'hue';