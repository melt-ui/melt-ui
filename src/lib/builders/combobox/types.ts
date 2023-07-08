import type { createCombobox } from './create';

export type CreateComboboxArgs<T> = {
	/** The list of items to display in the combobox. */
	items: T[];
	/**
	 * Determines behavior when scrolling items into view.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block
	 */
	scrollAlignment?: 'nearest' | 'center';
	/**
	 * Predicate function to filter the visible items. When the user types,
	 * the filterFunction will be run on each item along with the current
	 * input value. If the predicate returns true, the item will be displayed.
	 * @param item the current item being filtered.
	 * @param value the current input value.
	 * @returns whether the item should be visible.
	 */
	filterFunction: (item: T, value: string) => boolean;
	itemToString: (item: T) => string;
	loop?: boolean;
};

export type ComboboxItemArgs<T> = {
	item: T;
	/** Array index of the item. */
	index: number;
	/** Is the item disabled? */
	disabled?: boolean;
};

// export type CreateComboboxReturn<T> = {
// 	/** List items to display that match the current filter. */
// 	filteredItems: Readable<T[]>;
// 	/** Action & attributes to apply to the input element. */
// 	input: Readable<HTMLInputAttributes & Action<HTMLInputElement, void>> &
// 		Action<HTMLInputElement, void>;
// 	/** Current input value. */
// 	inputValue: Writable<string>;
// 	/** Function to determine if a given item is selected. */
// 	isSelected: Readable<(item: T) => boolean>;
// 	/** Action & attributes to apply to each item in the menu. */
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: improve this type
// 	item: Readable<(args: ComboboxItemArgs<T>) => any> & Action<HTMLElement, void>;
// 	/** Action & attributes to apply to the menu. */
// 	menu: Readable<HTMLAttributes<HTMLElement & Action<HTMLInputElement, void>>> &
// 		Action<HTMLElement, void>;
// 	/** Is the menu currently open? */
// 	open: Writable<boolean>;
// 	/** Top-level configuration for the Combobox instance. */
// 	options: Writable<Omit<CreateComboboxArgs<T>, 'items'>>;
// 	/** The currently selected item. */
// 	selectedItem: Writable<T | undefined>;
// 	/** Function to update the items in the combobox. */
// 	updateItems: (updaterFunction: (currentItems: T[]) => T[]) => void;
// };

// TODO: improve type
export type CreateComboboxReturn = ReturnType<typeof createCombobox>;
