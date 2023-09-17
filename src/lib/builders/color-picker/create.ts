import { addMeltEventListener, builder, createElHelpers, executeCallbacks, isBrowser } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";
import { onMount } from "svelte";

import type { ColorHSL, ColorHSV, ColorPickerParts, ColorRGB, CreateColorPickerProps, NodeElement, NodeSize, Position } from "./types";
import { get, writable, type Writable } from "svelte/store";


const defaults = {
    forceVisible: false,
    defaultColor: '#ff0000',
    hueSliderOrientation: 'horizontal',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
    const argsWithDefaults = { ...defaults, ...args }; 

    let dragging = false;
    let hueDragging = false;
    let alphaDragging = false;

    const colorCanvasDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
    const colorPickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
    const colorPickerPos: Writable<{ x: number; y: number; }> = writable({ x: 0, y: 0 });

    const hueSliderDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
    const huePickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
    const huePickerPos: Writable<Position> = writable({ x: 0, y: 0 });

    const hueAngle: Writable<number> = writable(0);

    /**
     * TODO: Helper functions
     * - [ ] getCurrentColor()
     * - [ ] ...
     * - [ ] builder: eye dropper: https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
     */

    const isValidHex = (hex: string) => /^#([0-9a-f]{3}){1,2}$/i.test(hex);

    const colorCanvas = builder(name('color-canvas'), {
        stores: [hueAngle],
        returned: ([$hueAngle]) => {
            return {
                style: `background-color: hsl(${$hueAngle}, 100%, 50%); background-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));`
            }
        },
        action: (node: HTMLCanvasElement) => {
            const rect = node.getBoundingClientRect();

            colorCanvasDims.set({
                node,
                width: rect.width,
                height: rect.height
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    const { offsetX: x, offsetY: y } = e;
                    colorPickerPos.set({ x, y });
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!dragging) return;

                    const { offsetX: x, offsetY: y } = e;
                    colorPickerPos.set({ x, y });
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    const colorPicker = builder(name('color-picker'), {
        stores: [colorPickerPos, hueAngle, colorPickerDims, colorCanvasDims],
        returned: ([$colorPickerPos, $hueAngle, $colorPickerDims, $colorCanvasDims]) => {
            const top = Math.round($colorPickerPos.y - $colorPickerDims.height / 2);
            const left = Math.round($colorPickerPos.x - $colorPickerDims.width / 2);

            const x = $colorPickerPos.x / $colorCanvasDims.width;
            const y = 1 - $colorPickerPos.y / $colorCanvasDims.height;

            const rgb = HSVtoRGB($hueAngle / 360, x, y);

            return {
                style: `position: absolute; top: ${top}px; left: ${left}px; background-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`
            }
        },
        action: (node: HTMLButtonElement) => {
            const rect = node.getBoundingClientRect();

            colorPickerDims.set({
                width: rect.width,
                height: rect.height
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'mousedown', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key)) return;

                    e.preventDefault();

                    const { x, y } = get(colorPickerPos);
                    const { height: canvasH, width: canvasW } = get(colorCanvasDims);

                    // Move the picker button and restrict movement to within the canvas.
                    if (key === 'ArrowUp' && y - 1 >= 0) {
                        colorPickerPos.set({ x, y: y - 1 });
                    } else if (key === 'ArrowDown' && y + 1 <= canvasH) {
                        colorPickerPos.set({ x, y: y + 1 });
                    } else if (key === 'ArrowRight' && x + 1 <= canvasW) {
                        colorPickerPos.set({ x: x + 1, y });
                    } else if (key === 'ArrowLeft' && x - 1 >= 0) {
                        colorPickerPos.set({ x: x - 1, y });
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

    const hueSlider = builder(name('hue-slider'), {
        returned: () => {
            const orientation = argsWithDefaults.hueSliderOrientation === 'horizontal' ? 'right' : 'bottom';

            // Create hue color gradient.
            const hueColors: string[] = [];

            for (let i = 0; i < 360; i++) {
                hueColors.push(`hsl(${i}, 100%, 50%)`)
            }

            return {
                style: `background: linear-gradient(to ${orientation}, ${hueColors.join(',')});`
            }
        },
        action: (node: HTMLCanvasElement) => {
            const rect = node.getBoundingClientRect();

            hueSliderDims.set({
                node,
                width: rect.width,
                height: rect.height
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    const { offsetX: x } = e;

                    hueAngle.set(Math.round(x / get(hueSliderDims).width * 360));
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    hueDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    hueDragging = false;
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!hueDragging) return;

                    const { offsetX: x } = e;
                    hueAngle.set(Math.round(x / get(hueSliderDims).width * 360));
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    const huePicker = builder(name('hue-picker'), {
        stores: [hueAngle, huePickerDims, hueSliderDims],
        returned: ([$hueAngle, $huePickerDims, $hueSliderDims]) => {
            const left = Math.round($hueAngle / 360 * $hueSliderDims.width - $huePickerDims.width / 2);

            return {
                style: `position: absolute; background: hsl(${$hueAngle}, 100%, 50%); left: ${left}px; top: 50%; transform: translateY(-50%);`
            }
        },
        action: (node: HTMLButtonElement) => {
            const rect = node.getBoundingClientRect();

            huePickerDims.set({
                height: rect.height,
                width: rect.width,
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'mousedown', () => {
                    hueDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    hueDragging = false;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key)) return;

                    e.preventDefault();

                    const angle = get(hueAngle);

                    // Move the picker button and restrict movement to within the canvas.
                    if (key === 'ArrowRight' && angle + 1 < 360) {
                        hueAngle.set(angle + 1);
                    } else if (key === 'ArrowLeft' && angle - 1 >= 0) {
                        hueAngle.set(angle - 1);
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

    // Helper functions
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

    function HSVtoRGB(h: number, s: number, v: number) {
        let r = 0;
        let g = 0;
        let b = 0;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
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

    /**
     * Move the color picker around the edges of the canvas element
     * if the mouse moves outside of the canvas element.
     * @param e The mousemove event.
     */
    function handleWindowsMouseMove(e: MouseEvent) {

        if (dragging) {
            const cc = get(colorCanvasDims);

            if (!cc.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = cc;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            if (x <= nodeX && y <= nodeY) {
                colorPickerPos.set({ x: 0, y: 0 });
            } else if (x <= nodeX && y <= nodeY + height ) {
                colorPickerPos.set({ x: 0, y: y - nodeY });
            } else if (x <= nodeX && y > nodeY + height ) {
                colorPickerPos.set({ x: 0, y: height });
            } else if (x <= nodeX + width && y <= nodeY) {
                colorPickerPos.set({ x: x - nodeX, y: 0 });
            } else if (x <= nodeX + width && y > nodeY + height) {
                colorPickerPos.set({ x: x - nodeX, y: height });
            } else if (x > nodeX + width && y <= nodeY) {
                colorPickerPos.set({ x: width, y: 0 });
            } else if (x > nodeX + width && y <= nodeY + height ) {
                colorPickerPos.set({ x: width, y: y - nodeY });
            } else if (x > nodeX + width && y > nodeY + height) {
                colorPickerPos.set({ x: width, y: height });
            }
        } else if (hueDragging) {
            const hs = get(hueSliderDims);

            if (!hs.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = hs;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            if (x < nodeX) {
                hueAngle.set(0);
            } else if (x <= nodeX + width && (y <= nodeY || y > nodeY + height)) {
                hueAngle.set(Math.round((x - nodeX) / width * 359));
            } else if (x >= nodeX + width) {
                hueAngle.set(359);
            }
        }

    }

    /**
     * Turn off dragging if a mouse up event occurs outside of
     * the canvas element while dragging is going on.
     * @param e The mouse up event.
     */
    function handleWindowsMouseUp(e: MouseEvent) {
        if (dragging) {
            const cc = get(colorCanvasDims);

            if (!cc.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = cc;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
                dragging = false;
            }
        } else if (hueDragging) {
            const hs = get(hueSliderDims);

            if (!hs.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = hs;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
                hueDragging = false;
            }
        }
    }

    function updateOnColorInput(hex: string) {
        const hsv = hexToHSV(hex);

        const { width, height } = get(colorCanvasDims);
        hueAngle.set(hsv.h);

        colorPickerPos.set({
            x: Math.round(hsv.s * width),
            y: Math.round((1 - hsv.v) * height)
        });
    }

    onMount(() => {
        if (isBrowser) {
            window.addEventListener('mousemove', handleWindowsMouseMove);
            window.addEventListener('mouseup', handleWindowsMouseUp);
        }
        // if (colorCanvas) {
        //     const size = colorCanvas.getBoundingClientRect();
        //     colorCanvasSize = {
        //         width: size.width,
        //         height: size.height
        //     };
        // }
        // if (!isValidHex(argsWithDefaults.defaultColor)) return;

        // updateOnColorInput(argsWithDefaults.defaultColor);
        argsWithDefaults.defaultColor = isValidHex(argsWithDefaults.defaultColor) ? argsWithDefaults.defaultColor : defaults.defaultColor;

        updateOnColorInput(argsWithDefaults.defaultColor);

        /**
         * TODO:
         * - [ ] update the hue slider button to be at the right degree
         * - [ ] update the canvas button to be at the right spot depending on s & l values
         */

        return () => {
            window.removeEventListener('mousemove', handleWindowsMouseMove);
            window.removeEventListener('mouseup', handleWindowsMouseUp);
        }
    });

    return {
        elements: {
            colorCanvas,
            colorPicker,
            hueSlider,
            huePicker
        }
    }
}