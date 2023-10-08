import type { ColorHSL, ColorHSV, ColorRGB } from "../types";

/**
 * Determines if the hex color value is valid.
 * Eg. #fff and #ffffff (3 and 6 values are considered valid).
 *
 * @param hex - The hex color string value
 * @returns Whether it's a valid hex value as a boolean
 */
export const isValidHexColor = (hex: string) => /^#([0-9a-f]{3}){1,2}$/i.test(hex);

// Source: https://css-tricks.com/converting-color-spaces-in-javascript/

/**
 * Convert an RGB color value to a hex representation.
 *
 * @param rgb - The RGB values
 * @returns The color as a hex value string
 */
export function RGBtoHex(rgb: ColorRGB) {
    const { r, g, b } = rgb;

    const hex = [r, g, b].map((x) => {
        const xHex = x.toString(16);

        return xHex.length === 1 ? `0${xHex}` : xHex;
    }).join('');

    return `#${hex}`;
}

/**
 * Converts a hex color value to RGB.
 *
 * @param hex - The hex color value
 * @param normalize - Whether to normalize the RGB values between 0 and 1
 * @returns The RGV values
 */
export function hexToRGB(hex: string, normalize=false): ColorRGB {
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

/**
 * Converts a hex color value to HSL.
 *
 * @param hex - The hex color value
 * @returns The HSL values
 */
export function hexToHSL(hex: string): ColorHSL {
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

/**
 * Converts HSV values to RGB.
 *
 * @param hsv - The HSV values
 * @returns The RGB values
 */
export function HSVtoRGB(hsv: ColorHSV) {
    const { h, s, v } = hsv;

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

/**
 * Converts a hex color value to HSV.
 *
 * @param hex - The hex color value
 * @returns The HSV color values
 */
export function hexToHSV(hex: string): ColorHSV {
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