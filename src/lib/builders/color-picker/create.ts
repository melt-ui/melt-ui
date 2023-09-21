import { addMeltEventListener, builder, createElHelpers, executeCallbacks, isBrowser } from "$lib/internal/helpers";
import type { Defaults } from "$lib/internal/types";
import { onMount } from "svelte";

import type { ArrowKeys, ColorHSL, ColorHSV, ColorPickerParts, ColorRGB, CreateColorPickerProps, EyeDropper, KeyDurations, NodeElement, NodeSize, Position, ReturnedColor } from "./types";
import { derived, get, writable, type Readable, type Writable } from "svelte/store";


const defaults = {
    forceVisible: false,
    defaultColor: '#ff0000',
    hueSliderOrientation: 'horizontal',
    alphaSliderOrientation: 'horizontal',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

/**
 * TODO:
 * - [ ] create preview example of vertical sliders
 * - [ ] bind color store to changes in canvas
 * - [ ] create input builders
 * - [ ] create trigger builder to hide / show color-picker
 * - [ ] helper function for detecting the browser for eye dropper?
 * - [ ] ...
 */

export function createColorPicker(args?: CreateColorPickerProps) {
    const argsWithDefaults = { ...defaults, ...args };

    let dragging = false;
    let hueDragging = false;
    let alphaDragging = false;
    const speepUpStep = 5;

    const keyDurations = <KeyDurations>{};

    const color: Writable<string> = writable(defaults.defaultColor);

    const colorCanvasDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
    const colorPickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
    const colorPickerPos: Writable<{ x: number; y: number; }> = writable({ x: 0, y: 0 });

    const hueSliderDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
    const huePickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
    // const huePickerPos: Writable<Position> = writable({ x: 0, y: 0 });
    const hueAngle: Writable<number> = writable(0);

    const alphaSliderDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
    const alphaPickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
    const alphaValue: Writable<number> = writable(100);

    let eye: EyeDropper | null = null;

    const isValidHex = (hex: string) => /^#([0-9a-f]{3}){1,2}$/i.test(hex);

    const setAlphaValue = (x: number) => alphaValue.set(Math.round(x / get(alphaSliderDims).width * 100));

    /**
     * Update the canvases when the color changes.
     */
    // const updateCanvases = derived([color], ([$color]) => {
    //     if (isValidHex($color)) updateOnColorInput($color);
    // });

    /**
     * Returns the current color of the color picker.
     */
    const getCurrentColor: Readable<() => ReturnedColor> = derived([hueAngle, colorPickerPos, colorCanvasDims, alphaValue], ([$hueAngle, $colorPickerPos, $colorCanvasDims, $alphaValue]) => {
        const x = $colorPickerPos.x / $colorCanvasDims.width;
        const y = 1 - $colorPickerPos.y / $colorCanvasDims.height;

        const rgb = HSVtoRGB($hueAngle / 360, x, y);
        const hex = RGBtoHex(rgb);

        return () => ({ rgb: { ...rgb, a: $alphaValue }, hex });
    });

    const colorCanvas = builder(name('color-canvas'), {
        stores: [hueAngle],
        returned: ([$hueAngle]) => {
            return {
                'aria-label': 'Color canvas for showing saturation and brightness.',
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
                }),
                addMeltEventListener(node, 'touchstart', () => {
                    dragging = true;
                }),
                addMeltEventListener(node, 'touchend', () => {
                    dragging = false;
                }),
                addMeltEventListener(node, 'touchmove', (e) => {
                    if (!dragging) return;

                    const cc = get(colorCanvasDims);

                    if (!cc.node) return;

                    e.preventDefault();

                    const { clientX: x, clientY: y } = e.touches[0];
                    const { width, height, node } = cc;
                    const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

                    if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
                        colorPickerPos.set({ x: x - nodeX, y: y - nodeY });
                    } else {
                        handleOutsideColorCanvasMovement({ x, y, nodeX, nodeY, width, height });
                    }
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
        stores: [colorPickerPos, colorPickerDims, getCurrentColor],
        returned: ([$colorPickerPos, $colorPickerDims, $getCurrentColor]) => {
            const top = Math.round($colorPickerPos.y - $colorPickerDims.height / 2);
            const left = Math.round($colorPickerPos.x - $colorPickerDims.width / 2);

            const { rgb, hex } = $getCurrentColor();
            const { r, g, b } = rgb;

            color.set(hex);

            return {
                'aria-label': 'Button on color canvas, used to select the saturation and brightness.',
                style: `position: absolute; top: ${top}px; left: ${left}px; background-color: rgb(${r}, ${g}, ${b});`
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
                addMeltEventListener(node, 'keyup', (e) => {
                    const { key } = e;
                    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key)) return;

                    keyDurations[<ArrowKeys>key] = null;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key)) return;

                    e.preventDefault();

                    if (!keyDurations[<ArrowKeys>key]) {
                        keyDurations[<ArrowKeys>key] = Date.now();
                    }

                    const duration = Date.now() - keyDurations[<ArrowKeys>key];
                    const step = duration > 1000 ? speepUpStep : 1;

                    const { x, y } = get(colorPickerPos);
                    const { height: canvasH, width: canvasW } = get(colorCanvasDims);

                    // Move the picker button and restrict movement to within the canvas.
                    if (key === 'ArrowUp' && y - 1 >= 0) {
                        colorPickerPos.set({ x, y: Math.max(y - step, 0) });
                    } else if (key === 'ArrowDown' && y + 1 <= canvasH) {
                        colorPickerPos.set({ x, y: Math.min(y + step, canvasH) });
                    } else if (key === 'ArrowRight' && x + 1 <= canvasW) {
                        colorPickerPos.set({ x: Math.min(x + step, canvasW), y });
                    } else if (key === 'ArrowLeft' && x - 1 >= 0) {
                        colorPickerPos.set({ x: Math.max(x - step, 0), y });
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
                'aria-label': 'A canvas element showing all available hue colors.',
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
                }),
                addMeltEventListener(node, 'touchstart', () => {
                    hueDragging = true;
                }),
                addMeltEventListener(node, 'touchend', () => {
                    hueDragging = false;
                }),
                addMeltEventListener(node, 'touchmove', (e) => {
                    if (!hueDragging) return;

                    const hs = get(hueSliderDims);

                    if (!hs.node) return;

                    e.preventDefault();

                    const { clientX: x, clientY: y } = e.touches[0];
                    const { width, height, node } = hs;
                    const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

                    if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
                        hueAngle.set(Math.round((x - nodeX) / width * 359));
                    } else {
                        handleOutsideHueMovement({ x, y, nodeX, nodeY, width, height });
                    }
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
                'aria-label': 'The button to select the hue color.',
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

    const alphaSlider = builder(name('alpha-slider'), {
        stores: [getCurrentColor],
        returned: ([$getCurrentColor]) => {
            const orientation = argsWithDefaults.hueSliderOrientation === 'horizontal' ? 'right' : 'bottom';

            const { rgb } = $getCurrentColor();
            const { r, g, b } = rgb;
            const color = `${r}, ${g}, ${b}`;

            return {
                'aria-label': 'A canvas element showing the alpha values for the color.',
                style: `background: linear-gradient(to ${orientation}, rgba(${color}, 0), rgba(${color}, 1));`
            }
        },
        action: (node: HTMLCanvasElement) => {
            const rect = node.getBoundingClientRect();

            alphaSliderDims.set({
                node,
                width: rect.width,
                height: rect.height
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', (e) => {
                    const { offsetX: x } = e;

                    setAlphaValue(x);
                }),
                addMeltEventListener(node, 'mousedown', () => {
                    alphaDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    alphaDragging = false;
                }),
                addMeltEventListener(node, 'mousemove', (e) => {
                    if (!alphaDragging) return;

                    const { offsetX: x } = e;
                    setAlphaValue(x);
                }),
                addMeltEventListener(node, 'touchstart', () => {
                    alphaDragging = true;
                }),
                addMeltEventListener(node, 'touchend', () => {
                    alphaDragging = false;
                }),
                addMeltEventListener(node, 'touchmove', (e) => {
                    if (!alphaDragging) return;

                    const as = get(alphaSliderDims);

                    if (!as.node) return;

                    e.preventDefault();

                    const { clientX: x, clientY: y } = e.touches[0];
                    const { width, height, node } = as;
                    const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

                    if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
                        alphaValue.set(Math.round((x - nodeX) / width * 100));
                    } else {
                        handleOutsideAlphaMovement({ x, y, nodeX, nodeY, width, height });
                    }
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    const alphaPicker = builder(name('alpha-picker'), {
        stores: [alphaValue, alphaPickerDims, alphaSliderDims, getCurrentColor],
        returned: ([$alphaValue, $alphaPickerDims, $alphaSliderDims, $getCurrentColor]) => {
            const left = Math.round($alphaValue / 100 * $alphaSliderDims.width - $alphaPickerDims.width / 2);

            const { rgb } = $getCurrentColor();
            const { r, g, b } = rgb;

            return {
                'aria-label': 'The button to select the alpha value for the color.',
                style: `position: absolute; background: rgba(${r}, ${g}, ${b}, ${$alphaValue / 100}); left: ${left}px; top: 50%; transform: translateY(-50%);`
            }
        },
        action: (node: HTMLButtonElement) => {
            const rect = node.getBoundingClientRect();

            alphaPickerDims.set({
                height: rect.height,
                width: rect.width,
            });

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'mousedown', () => {
                    alphaDragging = true;
                }),
                addMeltEventListener(node, 'mouseup', () => {
                    alphaDragging = false;
                }),
                addMeltEventListener(node, 'keydown', (e) => {
                    const { key } = e;
                    const keys = ['ArrowLeft', 'ArrowRight'];

                    if (!keys.includes(key)) return;

                    e.preventDefault();

                    const alpha = get(alphaValue);

                    // Move the picker button and restrict movement to within the canvas.
                    if (key === 'ArrowRight' && alpha + 1 <= 100) {
                        alphaValue.set(alpha + 1);
                    } else if (key === 'ArrowLeft' && alpha - 1 >= 0) {
                        alphaValue.set(alpha - 1);
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

    const eyeDropper = builder(name('eye-dropper'), {
        returned: () => {
            return {
                'aria-label': 'An eye dropper button, allowing you to select any color on the screen.'
            }
        },
        action: (node: HTMLButtonElement) => {

            if (window.EyeDropper) {
                eye = new EyeDropper();
            }

            const unsubEvents = executeCallbacks(
                addMeltEventListener(node, 'click', () => {
                    if (!eye) return;

                    eye
                        .open()
                        .then((result) => updateOnColorInput(result.sRGBHex))
                        .catch((e) => console.log(e));
                })
            );

            return {
                destroy() {
                    unsubEvents();
                }
            }
        }
    });

    // Helper functions
    function RGBtoHex(rgb: ColorRGB) {
        const { r, g, b } = rgb;

        const hex = [r, g, b].map((x) => {
            const xHex = x.toString(16);

            return xHex.length === 1 ? `0${xHex}` : xHex;
        }).join('');

        return `#${hex}`;
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

    type HandleMovementArgs = {
        x: number;
        y: number;
        nodeX: number;
        nodeY: number;
        width: number;
        height: number;
    };

    function handleOutsideColorCanvasMovement(args: HandleMovementArgs) {
        const { x, y, nodeX, nodeY, width, height } = args;

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
    }

    function handleOutsideHueMovement(args: HandleMovementArgs) {
        const { x, y, nodeX, nodeY, width, height } = args;

        if (x <= nodeX) {
            hueAngle.set(0);
        } else if (x <= nodeX + width && (y <= nodeY || y >= nodeY + height)) {
            hueAngle.set(Math.round((x - nodeX) / width * 359));
        } else if (x >= nodeX + width) {
            hueAngle.set(359);
        }
    }

    function handleOutsideAlphaMovement(args: HandleMovementArgs) {
        const { x, y, nodeX, nodeY, width, height } = args;

        if (x <= nodeX) {
            alphaValue.set(0);
        } else if (x <= nodeX + width && (y <= nodeY || y >= nodeY + height)) {
            alphaValue.set(Math.round((x - nodeX) / width * 100));
        } else if (x >= nodeX + width) {
            alphaValue.set(100);
        }
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

            handleOutsideColorCanvasMovement({ x, y, nodeX, nodeY, width, height });
        } else if (hueDragging) {
            const hs = get(hueSliderDims);

            if (!hs.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = hs;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            handleOutsideHueMovement({ x, y, nodeX, nodeY, width, height });
        } else if (alphaDragging) {
            const as = get(alphaSliderDims);

            if (!as.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = as;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            handleOutsideAlphaMovement({ x, y, nodeX, nodeY, width, height });
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
        } else if (hueDragging || alphaDragging) {
            const dims = hueDragging ? get(hueSliderDims) : get(alphaSliderDims);

            if (!dims.node) return;

            e.preventDefault();

            const { clientX: x, clientY: y } = e;
            const { width, height, node } = dims;
            const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

            if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
                hueDragging = false;
                alphaDragging = false;
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

        // Check if the given color is valid and replace it with
        // the default color if not.
        argsWithDefaults.defaultColor = isValidHex(argsWithDefaults.defaultColor) ? argsWithDefaults.defaultColor : defaults.defaultColor;

        color.set(argsWithDefaults.defaultColor);

        // Update the color and hue picker button positions.
        updateOnColorInput(argsWithDefaults.defaultColor);

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
            huePicker,
            alphaSlider,
            alphaPicker,
            eyeDropper
        },
        states: {
            color
        },
        helpers: {
            getCurrentColor
        }
    }
}