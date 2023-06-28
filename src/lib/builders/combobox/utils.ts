interface NextIndexInput {
	/** Currently selected item index. */
	currentIndex: number;
	/** The number of items in the list. */
	itemCount: number;
	/**
	 * The number of items to traverse in the list. Eg:
	 * +10 would move down 10 items.
	 * -10 would move up 10 items.
	 */
	moveAmount: number;
}

/**
 * Returns the next index in an array based on the current index
 * and move amount. If the next index is out of bounds, it will
 * wrap around to the other end of the array.
 */
export function getNextIndex({ currentIndex, itemCount, moveAmount }: NextIndexInput): number {
	// Return early if there are no items.
	if (itemCount === 0) {
		return 0;
	}
	// Get the index of the last item in the list.
	const lastItemIndex = itemCount - 1;
	// Compute the next index by adding the move amount to the current index.
	const nextIndex = currentIndex + moveAmount;
	// If the computed index is negative, wrap back to the bottom of the list.
	if (nextIndex < 0) {
		return lastItemIndex;
	}
	// If the computed index is out of bounds, wrap back to the top of the list.
	if (nextIndex > lastItemIndex) {
		return 0;
	}
	// Otherwise, return the computed index.
	return nextIndex;
}

/** @TODO maybe support an array of attributes? */
export function setAttribute(el: Element, qualifiedName: string, value?: unknown) {
	typeof value !== 'undefined'
		? el.setAttribute(qualifiedName, String(value))
		: el.setAttribute(qualifiedName, '');
}
