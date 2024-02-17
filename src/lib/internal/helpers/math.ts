export function getDecimalCount(value: number) {
	return (String(value).split('.')[1] || '').length;
}

export function roundValue(value: number, decimalCount: number) {
	const rounder = Math.pow(10, decimalCount);
	return Math.round(value * rounder) / rounder;
}

export function snapValueToStep(value: number, min: number, max: number, step: number): number {
	const remainder = (value - (isNaN(min) ? 0 : min)) % step;
	let snappedValue =
		Math.abs(remainder) * 2 >= step
			? value + Math.sign(remainder) * (step - Math.abs(remainder))
			: value - remainder;

	if (!isNaN(min)) {
		if (snappedValue < min) {
			snappedValue = min;
		} else if (!isNaN(max) && snappedValue > max) {
			snappedValue = min + Math.floor((max - min) / step) * step;
		}
	} else if (!isNaN(max) && snappedValue > max) {
		snappedValue = Math.floor(max / step) * step;
	}

	const string = step.toString();
	const index = string.indexOf('.');
	const precision = index >= 0 ? string.length - index : 0;

	if (precision > 0) {
		const pow = Math.pow(10, precision);
		snappedValue = Math.round(snappedValue * pow) / pow;
	}

	return snappedValue;
}

export function clamp(min: number, value: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

/**
 * Returns the remainder of dividing `a` by `b`,
 * but always positive.
 *
 * @example
 * ```ts
 * -1 % 5 = -1
 * modulo(-1, 5) = 4
 * ```
 */
export function modulo(a: number, b: number) {
	return ((a % b) + b) % b;
}
