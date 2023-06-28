import { debounce } from './debounce';
import { handleRovingFocus } from './rovingFocus';

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
	let typed: string[] = [];

	const resetTyped = debounce(() => {
		typed = [];
	});

	const handleTypeaheadSearch = (key: string, items: HTMLElement[]) => {
		typed.push(key.toLowerCase());
		const typedString = typed.join('');
		const matchingOption = items.find((item) =>
			item.innerText.toLowerCase().startsWith(typedString)
		);

		if (matchingOption) {
			withDefaults.onMatch(matchingOption);
		}
		resetTyped();
	};

	return {
		typed,
		resetTyped,
		handleTypeaheadSearch,
	};
}
