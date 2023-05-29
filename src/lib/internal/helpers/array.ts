/**
 * Returns next item in array given an index. If index is last item, returns the first item.
 * If the index is not found, returns undefined.
 *
 * @category Array
 */
export function next<T>(array: T[], index: number, loop = true): T | undefined {
	if (index === array.length - 1) {
		return loop ? array[0] : array[index];
	}
	return array[index + 1];
}

/**
 * Returns previous item in array given an index. If index is first item, returns the last item.
 * If the index is not found, returns undefined.
 * @category Array
 */
export function prev<T>(array: T[], index: number, loop = true): T | undefined {
	if (index === 0) {
		return loop ? array[array.length - 1] : array[index];
	}
	return array[index - 1];
}

export function last<T>(array: T[]): T | undefined {
	return array[array.length - 1];
}
