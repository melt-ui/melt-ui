import type { GroupedEvents, MeltComponentEvents } from "$lib/internal/types"

export const colorPickerEvents = {
    colorCanvas: ['click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'] as const,
    colorPicker: ['mousedown', 'mouseup', 'keyup', 'keydown'] as const,
    hueSlider: ['click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'] as const,
    huePicker: ['mousedown', 'mouseup', 'keydown'] as const,
    alphaSlider: ['click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'] as const,
    alphaPicker: ['mousedown', 'mouseup', 'keydown'] as const,
    eyeDropper: ['click'] as const,
    hexInput: ['keydown', 'blur'] as const

};

export type ColorPickerEvents = GroupedEvents<typeof colorPickerEvents>;
export type ColorPickerComponentEvents = MeltComponentEvents<ColorPickerEvents>;