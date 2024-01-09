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

/**
 * Toggles an item in an array. If the item is already in the array,
 * it is removed. Otherwise, it is added.
 * @param item The item to toggle.
 * @param array The array to toggle the item in.
 * @returns The updated array with the item toggled.
 * @template T The type of the items in the array.
 * @example ```typescript
 * const arr = [1, 2, 3];
 * const newArr = toggle(2, arr);
 * // newArr = [1, 3]
 * ```
 */
export function toggle<T>(
	item: T,
	array: T[],
	compare: (itemA: T, itemB: T) => boolean = deepEqual
): T[] {
	const itemIdx = array.findIndex((innerItem) => compare(innerItem, item));
	if (itemIdx !== -1) {
		array.splice(itemIdx, 1);
	} else {
		array.push(item);
	}

	return array;
}

/**
 * Splits an array into chunks of a given size.
 * @param arr The array to split.
 * @param size The size of each chunk.
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 * @example ```ts
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(arr, 3);
 * // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}

/**
 * Checks if the given index is valid for the given array.
 *
 * @param index - The index to check
 * @param arr - The array to check
 */

export function isValidIndex(index: number, arr: unknown[]) {
	return index >= 0 && index < arr.length;
}
