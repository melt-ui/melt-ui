import { get, writable, type Writable } from 'svelte/store';
import { debounce } from './debounce';
import { handleRovingFocus } from './rovingFocus';
import { isHTMLElement } from './is';
import { wrapArray } from './array';

export type TypeaheadArgs = {
	/**
	 * What to do when a match is found, usually highlight/focus the element.
	 * @param element The element that matches the typed keys
	 */
	onMatch?: (element: HTMLElement) => void;
};

export type HandleTypeaheadSearch = {
	/**
	 * Handle the typeahead search
	 * @param key The key that was pressed
	 * @param menuItems The menu items to search through
	 */
};

/**
 * Default options for the typeahead search.
 * We default to roving focus when a match is found, but
 * you can override this with the `onMatch` option.
 */
const defaults = {
	onMatch: handleRovingFocus,
} satisfies TypeaheadArgs;

export function createTypeaheadSearch(args: TypeaheadArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const typed: Writable<string[]> = writable([]);

	const resetTyped = debounce(() => {
		typed.update(() => []);
	});

	const handleTypeaheadSearch = (key: string, items: HTMLElement[]) => {
		const currentItem = document.activeElement;
		if (!isHTMLElement(currentItem)) return;
		const $typed = get(typed);
		if (!Array.isArray($typed)) {
			return;
		}
		$typed.push(key.toLowerCase());
		typed.update(() => $typed);

		const candidateItems = items.filter((item) => {
			if (
				item.getAttribute('disabled') === 'true' ||
				item.getAttribute('aria-disabled') === 'true' ||
				item.hasAttribute('data-disabled')
			) {
				return false;
			}
			return true;
		});

		const isRepeated = $typed.length > 1 && $typed.every((char) => char === $typed[0]);
		const normalizeSearch = isRepeated ? $typed[0] : $typed.join('');
		const currentItemIndex = currentItem ? candidateItems.indexOf(currentItem) : -1;

		let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
		const excludeCurrentItem = normalizeSearch.length === 1;
		if (excludeCurrentItem) {
			wrappedItems = wrappedItems.filter((v) => v !== currentItem);
		}

		const nextItem = wrappedItems.find((item) =>
			item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase())
		);

		if (isHTMLElement(nextItem) && nextItem !== currentItem) {
			withDefaults.onMatch(nextItem);
		}

		resetTyped();
	};

	return {
		typed,
		resetTyped,
		handleTypeaheadSearch,
	};
}
