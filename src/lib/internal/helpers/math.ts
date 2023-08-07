/**
 * Clamps a value between a minimum and maximum value.
 *
 * @param {number} val - The value to be clamped.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {number} The clamped value.
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
