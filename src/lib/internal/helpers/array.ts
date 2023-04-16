/**
 * Returns next item in array given an index. If index is last item, returns the first item.
 * If the index is not found, returns undefined.
 *
 * @category Array
 */
export function next<T>(array: T[], index: number): T | undefined {
	if (index === array.length - 1) {
		return array[0];
	}
	return array[index + 1];
}

/**
 * Returns previous item in array given an index. If index is first item, returns the last item.
 * If the index is not found, returns undefined.
 * @category Array
 */
export function prev<T>(array: T[], index: number): T | undefined {
	if (index === 0) {
		return array[array.length - 1];
	}
	return array[index - 1];
}
