import { addMeltEventListener, builder, createElHelpers, executeCallbacks, generateId } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";

import type { ColorPickerParts, CreateColorPickerProps } from "./types";


const defaults = {
    forceVisible: false,
    defaultColor: '#ff0000',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
    const withDefaults = { ...defaults, ...args };

    let dragging = false;

    const rootIds = {
        trigger: generateId(),
        content: generateId(),
    };

    const trigger = builder(name('trigger'), {
        returned: () => {
            return {
                'aria-expanded': true
            }
        }
    });

    // https://codepen.io/pizza3/pen/BVzYNP
    const canvas = builder(name('canvas'), {
        action: (node: HTMLCanvasElement) => {
            const { width, height } = node;

            const ctx = node.getContext('2d');

            if (!ctx) return;

            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, width, height);

            const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
            gradWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradWhite;
            ctx.fillRect(0, 0, width, height);

            const gradBlack = ctx.createLinearGradient(0, 0, 0, height);
            gradBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = gradBlack;
            ctx.fillRect(0, 0, width, height);

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'mousedown', (e) => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', (e) => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!dragging) return;

                    console.log('e:', e.offsetX, e.offsetY);
                    const x = e.offsetX;
                    const y = e.offsetY;

                    const imageData = ctx.getImageData(x, y, 1, 1).data;
                    console.log(`image data ${imageData[0]}, ${imageData[1]}, ${imageData[2]}`);
                    console.log(`%c color`, `color: rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`);

                    // console.log(`%c image data ${imageData[0]}, ${imageData[1]}, ${imageData[2]}`, `color: rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`);
                })
            );


            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    return {
        elements: {
            trigger,
            canvas
        }
    }
}