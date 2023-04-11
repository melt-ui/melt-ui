import { clamp } from '$lib/helpers/numbers';

export type Direction = 'ltr' | 'rtl';
export type Side = 'top' | 'right' | 'bottom' | 'left';

export const PAGE_KEYS = ['PageUp', 'PageDown'];
export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export type SlideDirection = 'from-left' | 'from-right' | 'from-bottom' | 'from-top';
export const BACK_KEYS: Record<SlideDirection, string[]> = {
	'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
	'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
	'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
	'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
};

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export function linearScale(input: readonly [number, number], output: readonly [number, number]) {
	return (value: number) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}

export function getDecimalCount(value: number) {
	return (String(value).split('.')[1] || '').length;
}

export function roundValue(value: number, decimalCount: number) {
	const rounder = Math.pow(10, decimalCount);
	return Math.round(value * rounder) / rounder;
}

export function convertValueToPercentage(value: number, min: number, max: number) {
	const maxSteps = max - min;
	const percentPerStep = 100 / maxSteps;
	const percentage = percentPerStep * (value - min);
	return clamp(percentage, [0, 100]);
}

export function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
	const nextValues = [...prevValues];
	nextValues[atIndex] = nextValue;
	return nextValues.sort((a, b) => a - b);
}

/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
export function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
}

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values: number[]) {
	return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
	if (minStepsBetweenValues > 0) {
		const stepsBetweenValues = getStepsBetweenValues(values);
		const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
		return actualMinStepsBetweenValues >= minStepsBetweenValues;
	}
	return true;
}
