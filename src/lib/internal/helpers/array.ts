import { dequal as deepEqual } from 'dequal';

/**
 * Returns the element some number before the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first element will be returned.
 *   - If looping is enabled, the last element will be returned.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param increment the number of elements to move forward.
 * @param loop loop to the beginning of the array if the target index is out of bounds?
 */
export function back<T>(array: T[], index: number, increment: number, loop = true): T {
	const previousIndex = index - increment;
	if (previousIndex <= 0) {
		return loop ? array[array.length - 1] : array[0];
	}
	return array[previousIndex];
}

/**
 * Returns the element some number after the given index. If the target index is out of bounds:
 *   - If looping is disabled, the last element will be returned.
 *   - If looping is enabled, the first element will be returned.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param increment the number of elements to move forward.
 * @param loop loop to the beginning of the array if the target index is out of bounds?
 */
export function forward<T>(array: T[], index: number, increment: number, loop = true): T {
	const nextIndex = index + increment;
	if (nextIndex > array.length - 1) {
		return loop ? array[0] : array[array.length - 1];
	}
	return array[nextIndex];
}

/**
 * Returns the array element after to the given index.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
export function next<T>(array: T[], index: number, loop = true): T {
	if (index === array.length - 1) {
		return loop ? array[0] : array[index];
	}
	return array[index + 1];
}

/**
 * Returns the array element prior to the given index.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param loop loop to the end of the array if the previous index is out of bounds?
 */
export function prev<T>(array: T[], currentIndex: number, loop = true): T {
	if (currentIndex <= 0) {
		return loop ? array[array.length - 1] : array[0];
	}
	return array[currentIndex - 1];
}

/**
 * Returns the last element in an array.
 * @param array the array.
 */
export function last<T>(array: T[]): T {
	return array[array.length - 1];
}

/**
 * Wraps an array around itself at a given starting index.
 * @example ```ts
 * wrapArray(['a', 'b', 'c', 'd'], 2);
 * // ['c', 'd', 'a', 'b']
 * ```
 * @see https://github.com/radix-ui/primitives
 */
export function wrapArray<T>(array: T[], startIndex: number): T[] {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}

export function toggle<T>(item: T, array: T[]): T[] {
	const itemIdx = array.findIndex((i) => deepEqual(i, item));
	if (itemIdx !== -1) {
		array.splice(itemIdx, 1);
	} else {
		array.push(item);
	}

	return array;
}
