import { get, writable, type Writable } from 'svelte/store';
import { debounce } from './debounce.js';
import { handleRovingFocus } from './rovingFocus.js';
import { isHTMLElement } from './is.js';
import { wrapArray } from './array.js';

export type TypeaheadArgs = {
	/**
	 * What to do when a match is found, usually highlight/focus the element.
	 * @param element The element that matches the typed keys
	 */
	onMatch?: (element: HTMLElement) => void;
	/**
	 * Get the current item, usually the active element.
	 * @returns The current item
	 * @default () => document.activeElement
	 */
	getCurrentItem?: () => Element | null | undefined;
};

export type HandleTypeaheadSearch = {
	/**
	 * Handle the typeahead search
	 * @param key The key that was pressed
	 * @param menuItems The menu items to search through
	 */
};

/**
 * Keys to ignore for typeahead so we aren't matching things
 * like `Shift menu item` or `Control center` or `Alt menu` when
 * a user presses those keys.
 */
const ignoredKeys = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock']);

/**
 * Default options for the typeahead search.
 * We default to roving focus when a match is found, but
 * you can override this with the `onMatch` option.
 */
const defaults = {
	onMatch: handleRovingFocus,
	getCurrentItem: () => document.activeElement,
} satisfies TypeaheadArgs;

export function createTypeaheadSearch(args: TypeaheadArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const typed: Writable<string[]> = writable([]);

	const resetTyped = debounce(() => {
		typed.update(() => []);
	});

	const handleTypeaheadSearch = (key: string, items: HTMLElement[]) => {
		if (ignoredKeys.has(key)) return;
		const currentItem = withDefaults.getCurrentItem();

		const $typed = get(typed);
		if (!Array.isArray($typed)) {
			return;
		}
		$typed.push(key.toLowerCase());
		typed.set($typed);

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
		const currentItemIndex = isHTMLElement(currentItem) ? candidateItems.indexOf(currentItem) : -1;

		let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
		const excludeCurrentItem = normalizeSearch.length === 1;
		if (excludeCurrentItem) {
			wrappedItems = wrappedItems.filter((v) => v !== currentItem);
		}

		const nextItem = wrappedItems.find(
			(item) =>
				item?.innerText && item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase())
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
