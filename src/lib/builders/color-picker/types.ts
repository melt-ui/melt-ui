
export type CreateColorPickerProps = {
    forceVisible?: boolean;

    /**
     * Which color is selected by default.
     */
    defaultColor?: string;
}

export type ColorPickerParts = 'trigger' | 'canvas' | 'picker';