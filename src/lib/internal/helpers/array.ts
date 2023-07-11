/**
 * Returns next item in array given an index. If index is last item, returns the first item.
 * If the index is not found, returns undefined.
 * @category Array
 */
export function next<T>(array: T[], index: number, loop = true): T {
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
export function prev<T>(array: T[], index: number, loop = true): T {
	if (index <= 0) {
		return loop ? array[array.length - 1] : array[index];
	}
	return array[index - 1];
}

/**
 * Returns last item in array.
 * @category Array
 */
export function last<T>(array: T[]): T {
	return array[array.length - 1];
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 * Reference: https://github.com/radix-ui/primitives
 */
export function wrapArray<T>(array: T[], startIndex: number) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
