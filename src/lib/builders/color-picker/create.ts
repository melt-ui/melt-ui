import { addMeltEventListener, builder, createElHelpers, executeCallbacks, generateId } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";

import type { ColorPickerParts, CreateColorPickerProps, NodeElement } from "./types";


const defaults = {
    forceVisible: false,
    defaultColor: '#ff0000',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
    const withDefaults = { ...defaults, ...args };

    let canvasNode: NodeElement<HTMLCanvasElement> | null = null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    let pickerNode: NodeElement<HTMLButtonElement> | null = null;
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
    // https://codepen.io/g33kio/pen/MZrdaq
    const canvas = builder(name('canvas'), {
        action: (node: HTMLCanvasElement) => {
            const { width, height } = node;

            canvasNode = {
                node,
                width,
                height
            };

            canvasCtx = node.getContext('2d');

            if (!canvasCtx) return;

            canvasCtx.fillStyle = 'red';
            canvasCtx.fillRect(0, 0, width, height);

            const gradWhite = canvasCtx.createLinearGradient(0, 0, width, 0);
            gradWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
            canvasCtx.fillStyle = gradWhite;
            canvasCtx.fillRect(0, 0, width, height);

            const gradBlack = canvasCtx.createLinearGradient(0, 0, 0, height);
            gradBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');
            canvasCtx.fillStyle = gradBlack;
            canvasCtx.fillRect(0, 0, width, height);

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    if (!pickerNode || !canvasCtx) return;

                    const { offsetX: x, offsetY: y } = e;

                    const imageData = canvasCtx.getImageData(x, y, 1, 1).data;

                    pickerNode.node.style.left = `${x - pickerNode.width / 2}px`;
                    pickerNode.node.style.top = `${y - pickerNode.height / 2}px`;
                    pickerNode.node.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!dragging || !pickerNode || !canvasCtx) return;

                    const x = e.offsetX;
                    const y = e.offsetY;

                    const imageData = canvasCtx.getImageData(x, y, 1, 1).data;

                    pickerNode.node.style.left = `${x - pickerNode.width / 2}px`;
                    pickerNode.node.style.top = `${y - pickerNode.height / 2}px`;
                    pickerNode.node.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

                    // console.log(`image data ${imageData[0]}, ${imageData[1]}, ${imageData[2]}`);
                    // console.log(`%c color`, `color: rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`);
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

    const hue = builder(name('hue'), {
        action: (node: HTMLCanvasElement) => {
            const { width, height } = node;

            const ctx = node.getContext('2d');

            if (!ctx) return;

            // node.style.backgroundColor = 'linear-gradient(hsl(0, 100%, 50%)';

            const hueGradient = ctx.createLinearGradient(0, 0, width, 0);

            for (let i = 0; i < 360; i++) {
                const color = `hsl(${i}, 100%, 50%)`;
                hueGradient.addColorStop(i / 360, color);
            }

            ctx.fillStyle = hueGradient;
            ctx.fillRect(0, 0, width, height);

            // ctx.fillStyle = 'blue';
            // ctx.fillRect(0, 0, width, height);

            // const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
            // gradWhite.addColorStop(0, 'rgba(255, 255, 255, 1)');
            // gradWhite.addColorStop(1, 'rgba(255, 255, 255, 0)');
            // ctx.fillStyle = gradWhite;
            // ctx.fillRect(0, 0, width, height);

            // const gradBlack = ctx.createLinearGradient(0, 0, 0, height);
            // gradBlack.addColorStop(0, 'rgba(0, 0, 0, 0)');
            // gradBlack.addColorStop(1, 'rgba(0, 0, 0, 1)');
            // ctx.fillStyle = gradBlack;
            // ctx.fillRect(0, 0, width, height);

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'mousedown', (e) => {
                    // TODO
                }),
                addMeltEventListener(node, 'mouseup', (e) => {
                    // TODO
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    // TODO
                })
            );


            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    const picker = builder(name('picker'), {
        action: (node: HTMLButtonElement) => {
            const { height, width } = node.getBoundingClientRect();

            node.style.position = "absolute";
            node.style.left = `-${width / 2}px`;
            node.style.top = `-${height / 2}px`;
            node.style.backgroundColor = 'rgb(255, 255, 255)';

            pickerNode = {
                node,
                width,
                height
            }

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    e.preventDefault();
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key) || !canvasNode || !pickerNode || !canvasCtx) return;

                    e.preventDefault();

                    let updateColor = false;

                    // Move the picker button and restrict movement to within the canvas.
                    if (key === 'ArrowUp' && node.offsetTop - 1 > -1 * pickerNode.height / 2) {
                        node.style.top = `${node.offsetTop - 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowDown' && node.offsetTop + 1 < canvasNode.height - pickerNode.height / 2) {
                        node.style.top = `${node.offsetTop + 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowRight' && node.offsetLeft + 1 < canvasNode.width - pickerNode.width / 2) {
                        node.style.left = `${node.offsetLeft + 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowLeft' && node.offsetLeft - 1 > -1 * pickerNode.width / 2) {
                        node.style.left = `${node.offsetLeft - 1}px`;
                        updateColor = true;
                    }

                    if (updateColor) {
                        const imageData = canvasCtx.getImageData(node.offsetLeft + pickerNode.width / 2, node.offsetTop + pickerNode.height / 2, 1, 1).data;

                        pickerNode.node.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
                    }
                })
            );

            return {
                destroy() {
                    unsubEvents();
                },
            }
        }
    });

    return {
        elements: {
            trigger,
            canvas,
            picker,
            hue
        }
    }
}