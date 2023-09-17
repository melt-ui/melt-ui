import { addMeltEventListener, builder, createElHelpers, executeCallbacks, generateId } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";
import { onMount } from "svelte";

import type { ColorHSL, ColorHSV, ColorPickerParts, ColorRGB, CreateColorPickerProps, NodeElement } from "./types";


const defaults = {
    forceVisible: false,
    defaultColor: '#ff0000',
    hueSliderOrientation: 'horizontal',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
    const argsWithDefaults = { ...defaults, ...args };

    let canvasNode: NodeElement<HTMLCanvasElement> | null = null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    let pickerNode: NodeElement<HTMLButtonElement> | null = null;
    let hueNode: NodeElement<HTMLCanvasElement> | null = null;
    let hueCtx: CanvasRenderingContext2D | null = null;
    let huePickerNode: NodeElement<HTMLButtonElement> | null = null;
    let dragging = false;
    let hueDragging = false;

    /**
     * TODO: Helper functions
     * - [ ] getCurrentColor()
     * - [ ] ...
     */

    const isValidHex = (hex: string) => /^#([0-9a-f]{3}){1,2}$/i.test(hex);

    // const rootIds = {
    //     trigger: generateId(),
    //     content: generateId(),
    // };

    const trigger = builder(name('trigger'), {
        returned: () => {
            return {
                'aria-expanded': true
            }
        }
    });

    const canvas = builder(name('canvas'), {
        action: (node: HTMLCanvasElement) => {
            const { width, height } = node;

            canvasNode = {
                node,
                width,
                height
            };

            canvasCtx = node.getContext('2d', {
                willReadFrequently: true
            });

            if (!canvasCtx) return;

            fillPickerCanvas('#ff0000');

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    updatePickerButtonPosition(e);
                    updatePickerButtonColor();
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'mouseleave', (e) => {
                    if (!canvasNode) return;

                    const { offsetX: x, offsetY: y } = e;

                    if (x < 0 || x > canvasNode.width || y < 0 || y > canvasNode.height) {
                        hueDragging = false;
                    }
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!dragging) return;

                    updatePickerButtonPosition(e);
                    updatePickerButtonColor();
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

            hueNode = {
                node,
                width,
                height
            };

            hueCtx = node.getContext('2d', {
                willReadFrequently: true
            });

            if (!hueCtx) return;

            // node.style.backgroundColor = 'linear-gradient(hsl(0, 100%, 50%)';

            const hueGradient = hueCtx.createLinearGradient(0, 0, width, 0);

            for (let i = 0; i < 360; i++) {
                const color = `hsl(${i}, 100%, 50%)`;
                hueGradient.addColorStop(i / 360, color);
            }

            hueCtx.fillStyle = hueGradient;
            hueCtx.fillRect(0, 0, width, height);

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    updateHuePickerButtonPosition(e);
                    updateHuePickerButtonColor();
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    hueDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    hueDragging = false;
                }),
                addMeltEventListener(node, 'mouseleave', (e) => {
                    if (!hueNode) return;

                    const { offsetX: x, offsetY: y } = e;

                    if (x < 0 || x > hueNode.width || y < 0 || y > hueNode.height) {
                        hueDragging = false;
                    }
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!hueDragging) return;

                    updateHuePickerButtonPosition(e);
                    updateHuePickerButtonColor();
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

            // Set the starting position and color.
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

                    if (!keys.includes(key) || !canvasNode || !pickerNode) return;

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

                    if (updateColor) updatePickerButtonColor();
                })
            );

            return {
                destroy() {
                    unsubEvents();
                },
            }
        }
    });

    const huePicker = builder(name('hue-picker'), {
        action: (node: HTMLButtonElement) => {
            const { height, width } = node.getBoundingClientRect();

            huePickerNode = {
                node,
                height,
                width
            };

            // Set the starting position and color.
            node.style.position = "absolute";

            if (argsWithDefaults.hueSliderOrientation === 'horizontal') {
                node.style.left = `-${width / 2}px`;
                node.style.top = `50%`;
                node.style.transform = 'translateY(-50%)';
            } else {
                node.style.top = `-${height / 2}px`;
                node.style.left = `50%`;
                node.style.transform = 'translateX(-50%)';
            }
            node.style.backgroundColor = 'rgb(255, 0, 0)';

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    e.preventDefault();
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    hueDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    hueDragging = false;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key) || !hueNode || !huePickerNode) return;

                    e.preventDefault();

                    let updateColor = false;

                    const { hueSliderOrientation: orientation } = argsWithDefaults;

                    // Move the hue picker button and restrict movement to within the hue canvas.
                    if (key === 'ArrowRight' && orientation === 'horizontal' && node.offsetLeft + 1 < hueNode.width - huePickerNode.width / 2) {
                        node.style.left = `${node.offsetLeft + 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowLeft' && orientation === 'horizontal' && node.offsetLeft - 1 > -1 * huePickerNode.width / 2) {
                        node.style.left = `${node.offsetLeft - 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowUp' && orientation === 'vertical' && node.offsetTop - 1 > -1 * huePickerNode.height / 2) {
                        node.style.top = `${node.offsetTop - 1}px`;
                        updateColor = true;
                    } else if (key === 'ArrowDown' && orientation === 'vertical' && node.offsetTop + 1 < hueNode.height - huePickerNode.height / 2) {
                        node.style.top = `${node.offsetTop + 1}px`;
                        updateColor = true;
                    }

                    if (updateColor) updateHuePickerButtonColor();
                })
            );

            return {
                destroy() {
                    unsubEvents();
                },
            }
        }
    });

    // Helper functions

    /**
     * Updates the main canvas with a hue color and two gradients (to white and to black).
     * @param color a string color representation.
     */
    function fillPickerCanvas(color: string): void {
        if (!canvasNode || !canvasCtx) return;

        const { width, height } = canvasNode;

        canvasCtx.fillStyle = color;
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
    }

    function updatePickerButtonPosition(e: MouseEvent): void {
        if (!pickerNode || !canvasNode) return;

        const { offsetX: x, offsetY: y } = e;

        if (x <= 0 || y <= 0 || x >= canvasNode.width || y >= canvasNode.height) return;

        pickerNode.node.style.left = `${x - pickerNode.width / 2}px`;
        pickerNode.node.style.top = `${y - pickerNode.height / 2}px`;
    }

    function updatePickerButtonColor(): void {
        if (!canvasCtx || !pickerNode) return;

        const imageData = canvasCtx.getImageData(pickerNode.node.offsetLeft + pickerNode.width / 2, pickerNode.node.offsetTop + pickerNode.height / 2, 1, 1).data;

        pickerNode.node.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    }

    // Hue functions
    function updateHuePickerButtonPosition(e: MouseEvent): void {
        if (!huePickerNode || !hueNode) return;

        const { offsetX: x, offsetY: y } = e;

        if (x <= 0 || y <= 0 || x >= hueNode.width || y >= hueNode.height) return;

        huePickerNode.node.style.left = `${x - huePickerNode.width / 2}px`;
    }

    function updateHuePickerButtonColor(): void {
        if (!hueCtx || !huePickerNode) return;

        const imageData = hueCtx.getImageData(huePickerNode.node.offsetLeft + huePickerNode.width / 2, huePickerNode.node.offsetTop, 1, 1).data;
        const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        huePickerNode.node.style.backgroundColor = color;

        fillPickerCanvas(color);
        updatePickerButtonColor();
    }

    function hexToRGB(hex: string, normalize=false): ColorRGB {
        const rgb: ColorRGB = {
            r: 0,
            g: 0,
            b: 0
        };

        if (hex.length === 4) {
            rgb.r = parseInt(`0x${hex[1]}${hex[1]}`, 16);
            rgb.g = parseInt(`0x${hex[2]}${hex[2]}`, 16);
            rgb.b = parseInt(`0x${hex[3]}${hex[3]}`, 16);
        } else {
            rgb.r = parseInt(`0x${hex[1]}${hex[2]}`, 16);
            rgb.g = parseInt(`0x${hex[3]}${hex[4]}`, 16);
            rgb.b = parseInt(`0x${hex[5]}${hex[6]}`, 16);
        }

        if (normalize) {
            rgb.r = rgb.r / 255;
            rgb.g = rgb.g / 255;
            rgb.b = rgb.b / 255;
        }

        return rgb;
    }

    // Source: https://css-tricks.com/converting-color-spaces-in-javascript/
    function hexToHSL(hex: string): ColorHSL {
        const rgb = hexToRGB(hex, true);

        const cmin = Math.min(rgb.r, rgb.g, rgb.b);
        const cmax = Math.max(rgb.r, rgb.g, rgb.b);
        const delta = cmax - cmin;
        let h = 0;
        let s = 0;
        let l = 0;

        if (delta === 0) {
            h = 0;
        } else if (cmax === rgb.r) {
            h = ((rgb.g - rgb.b) / delta) % 6;
        } else if (cmax === rgb.g) {
            h = (rgb.b - rgb.r) / delta + 2;
        } else {
            h = (rgb.r - rgb.g) / delta + 4;
        }

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        // return "hsl(" + h + "," + s + "%," + l + "%)";
        return { h, s, l };
    }

    function hexToHSV(hex: string): ColorHSV {
        const { r, g, b} = hexToRGB(hex, true);

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const v = max;
        let h = 0;

        const d = max - min;
        const s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: Math.round(h * 360), s, v };
    }

    function updateOnColorInput(hex: string) {
        if (!canvasNode || !hueNode || !pickerNode || !huePickerNode) return;

        const { h, s, v } = hexToHSV(hex);

        // Update main canvas color and picker position.
        pickerNode.node.style.left = `${Math.round(canvasNode.width * s)}px`;
        pickerNode.node.style.top = `${Math.round((1 - v) * canvasNode.height)}px`;

        huePickerNode.node.style.left = `${Math.round(hueNode.width * h / 360)}px`;
        updateHuePickerButtonColor();
    }

    onMount(() => {
        if (!isValidHex(argsWithDefaults.defaultColor)) return;

        updateOnColorInput(argsWithDefaults.defaultColor);

        /**
         * TODO:
         * - [ ] update the hue slider button to be at the right degree
         * - [ ] update the canvas button to be at the right spot depending on s & l values
         */
    });

    return {
        elements: {
            trigger,
            canvas,
            picker,
            hue,
            huePicker
        }
    }
}