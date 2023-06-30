import { getNextIndex } from '@melt-ui/svelte/builders/combobox/utils';
import { usePopper, type FloatingConfig } from '@melt-ui/svelte/internal/actions';
import {
	addEventListener,
	effect,
	executeCallbacks,
	generateId,
	isBrowser,
	kbd,
	noop,
	sleep,
	styleToString,
} from '@melt-ui/svelte/internal/helpers';
import type { Defaults } from '@melt-ui/svelte/internal/types';
import { tick } from 'svelte';
import type { Action } from 'svelte/action';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLiAttributes } from 'svelte/elements';
import { derived, get, readonly, writable, type Readable, type Writable } from 'svelte/store';

interface CreateComboboxArgs<T> {
	/** The list of items to display in the combobox. */
	items: T[];
	/**
	 * Determines behavior when scrolling items into view.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block
	 */
	scrollAlignment?: 'nearest' | 'center';
	/** Is the combobox disabled? */
	disabled?: boolean;
	/**
	 * Predicate function to filter the visible items. When the user types,
	 * the filterFunction will be run on each item along with the current
	 * input value. If the predicate returns true, the item will be displayed.
	 * @param item the current item being filtered.
	 * @param value the current input value.
	 * @returns whether the item should be visible.
	 */
	filterFunction: (item: T, value: string) => boolean;
	positioning?: FloatingConfig;
	itemToString: (item: T) => string;
}

interface OptionArgs {
	/** Array index of the option. */
	index: number;
	/** Is the option disabled? */
	disabled?: boolean;
}

interface Combobox<T> {
	/** List items to display that match the current filter. */
	filteredItems: Readable<T[]>;
	/** Action & attributes to apply to the input element. */
	input: Readable<HTMLInputAttributes> & {
		action: Action<HTMLInputElement, void>;
	};
	/** Current input value. */
	inputValue: string;
	/** Function to determine if a given item is selected. */
	isSelected: Readable<(item: T) => boolean>;
	/** Action & attributes to apply to the menu. */
	menu: Readable<HTMLAttributes<HTMLUListElement>> & {
		action: Action<HTMLUListElement, void>;
	};
	/** Is the menu currently open? */
	open: Writable<boolean>;
	/** Action & attributes to apply to each option in the list. */
	option: Readable<(args: OptionArgs) => HTMLLiAttributes> & {
		action: Action<HTMLLIElement, void>;
	};
	/** Top-level configuration for the Combobox instance. */
	options: Writable<CreateComboboxArgs<T>>;
	/** Function to update the list of items in the combobox. */
	updateItems: (updaterFunction: (currentItems: T[]) => T[]) => void;
}

const defaults = {
	disabled: false,
	scrollAlignment: 'nearest',
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
} satisfies Defaults<CreateComboboxArgs<unknown>>;

/**
 * BUGS
 * - don't clear the input on `esc` if a value is selected
 * - all items disabled—first is highlighted
 * - stop highlighting on mouseover disabled items
 *
 * POLISH PASS
 * - figure out how our utils <> their utils
 * - Omit the `items` from the $options store
 * - Naming of variables, etc.
 * - Add item selection data attributes from `select`
 *
 * POST-PR
 * - Setting initial value
 * - "Fancy" options
 * - Empty state
 *
 * THONK
 *  - replace updateList with an option setter
 */
export function createCombobox<T>(args: CreateComboboxArgs<T>): Combobox<T> {
	const options = writable<CreateComboboxArgs<T>>({ ...defaults, ...args });
	const open = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);
	const selectedItem = writable<T>(undefined);
	const inputValue = writable('');

	const highlightedItem = writable(0);
	const items = writable(args.items);
	/**
	 * A subset of `items` that match the `filterFunction` predicate.
	 */
	const filteredItems = writable(args.items);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	/** Action and attributes for the text input element. */
	const input = {
		...derived(
			[open, options],
			([$open, $options]) =>
				({
					'aria-autocomplete': 'list',
					'aria-controls': ids.menu,
					'aria-expanded': $open,
					'aria-labelledby': ids.label,
					autocomplete: 'off',
					'data-disabled': $options.disabled ? true : undefined,
					disabled: $options.disabled,
					id: ids.input,
					role: 'combobox',
				} as const)
		),
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'blur', () => {
					highlightedItem.set(-1);
				}),
				addEventListener(node, 'focus', (e) => {
					// @TODO: abstract and use the input id instead? Thinking of this due to keyboard events also opening the box (although in testing, I haven't had any issues yet)
					const triggerEl = e.currentTarget as HTMLElement;
					activeTrigger.set(triggerEl);
					open.set(true);
				}),
				addEventListener(node, 'keydown', (e) => {
					const $open = get(open);
					// Handle key events when the menu is closed.
					if (!$open) {
						// The user presses `esc`. The input should be cleared and lose focus.
						if (e.key === kbd.ESCAPE) {
							node.blur();
							node.value = '';
							return;
						}

						// Don't open the menu on backspace if the input is blank.
						if (e.key === kbd.BACKSPACE && node.value === '') {
							return;
						}

						// Otherwise, open the input.
						open.set(true);
					}

					// Handle key events when the menu is open.
					switch (e.key) {
						case kbd.ESCAPE: {
							open.set(false);
							break;
						}
						case kbd.ENTER: {
							const $highlightedIndex = get(highlightedItem);
							1;
							setSelectedItem($highlightedIndex);
							open.set(false);
							break;
						}
						case kbd.HOME: {
							highlightedItem.set(0);
							break;
						}
						case kbd.END: {
							const nextIndex = get(numberOfItems) - 1;
							highlightedItem.set(nextIndex);
							break;
						}
						/** @FIXME */
						// case kbd.PAGE_UP: {
						// 	const $highlightedIndex = get(highlightedItem);
						// 	const nextIndex = getNextIndex({
						// 		currentIndex: $highlightedIndex,
						// 		itemCount: $options.items.length,
						// 		moveAmount: -10,
						// 	});
						// 	highlightedItem.set(nextIndex);
						// 	break;
						// }
						// case kbd.PAGE_DOWN: {
						// 	const $highlightedIndex = get(highlightedItem);
						// 	const nextIndex = getNextIndex({
						// 		currentIndex: $highlightedIndex,
						// 		itemCount: $options.items.length,
						// 		moveAmount: 10,
						// 	});
						// 	highlightedItem.set(nextIndex);
						// 	break;
						// }
						case kbd.ARROW_DOWN: {
							highlightedItem.update((item) => {
								return getNextIndex({
									currentIndex: item,
									itemCount: get(numberOfItems) + 1,
									moveAmount: 1,
								});
							});
							break;
						}
						case kbd.ARROW_UP: {
							if (e.altKey) {
								close();
								return;
							}
							highlightedItem.update((item) => {
								return getNextIndex({
									currentIndex: item,
									itemCount: get(numberOfItems) + 1,
									moveAmount: -1,
								});
							});
							break;
						}
					}
				}),
				addEventListener(node, 'input', (e) => {
					const $options = get(options);
					const value = (e.target as HTMLInputElement).value;
					inputValue.set(value);
					filteredItems.set($options.items.filter((item) => $options.filterFunction(item, value)));
				})
			);

			return { destroy: unsub };
		},
	};

	/**
	 *
	 * @param index
	 * @param input
	 */
	function setSelectedItem(index: number) {
		const $options = get(options);
		const item = get(filteredItems)[index];
		selectedItem.set(item);
		const inputEl = document.getElementById(ids.input);
		if (!(inputEl instanceof HTMLInputElement)) return;
		inputEl.value = $options.itemToString(item);
	}

	/**
	 * Function to determine if a given item is selected.
	 * This is useful for displaying additional markup on the selected item.
	 */
	const isSelected = derived([selectedItem], ([$selectedItem]) => {
		return (item: T) => $selectedItem === item;
	});

	const menu = {
		...derived([open], ([$open]) => ({
			hidden: $open ? undefined : true,
			id: ids.menu,
			role: 'listbox',
			style: styleToString({
				display: $open ? undefined : 'none',
			}),
		})),
		action: (node: HTMLUListElement) => {
			let unsubPopper = noop;
			const unsubDerived = effect(
				[open, activeTrigger, options],
				([$open, $activeTrigger, $options]) => {
					// @TODO can we get rid of the noop execution?
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger, // $activeTrigger is our input element
								open,
								options: { floating: $options.positioning },
							});
							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				}
			);

			// When the cursor is outside the menu, unhighlight items.
			const unsub = addEventListener(node, 'mouseout', () => {
				highlightedItem.set(-1);
			});

			return {
				destroy: () => {
					unsub();
					unsubDerived();
					unsubPopper();
				},
			};
		},
	};
	const numberOfItems = writable(-1);

	effect([open, options, highlightedItem], ([$open, $options, $highlightedItem]) => {
		if (!isBrowser) return;

		if (!$open) {
			numberOfItems.set(-1);
		}

		const menuEl = document.getElementById(ids.menu);
		if (menuEl && $open) {
			// Focus on selected option or first option
			const selectedOption = menuEl.querySelector(`[data-index="${$highlightedItem}"]`);
			if (selectedOption) {
				sleep(1).then(() => selectedOption.scrollIntoView({ block: $options.scrollAlignment }));
			}
		}
	});

	const option = {
		...derived([highlightedItem], ([$highlightedItem]) => (args: OptionArgs) => ({
			// @TODO set activedescendant on the input.
			// "aria-activedescendant"
			// 'aria-selected': $value === args?.value,
			// 'data-selected': $value === args?.value ? '' : undefined,
			'data-highlighted': $highlightedItem === args?.index,
			'data-disabled': args.disabled ? '' : undefined,
			'data-list-item': 'data-list-item',
			'data-index': args?.index, // non existent or -1
			role: 'option',
			id: `${ids.input}-descendent-${args?.index}`,
		})),
		action: (node: HTMLLIElement) => {
			// @FIXME
			if (typeof node.dataset?.disabled === 'undefined') {
				numberOfItems.update((value) => value + 1);
			}
			const unsub = executeCallbacks(
				addEventListener(node, 'mousemove', () => {
					const { index } = node.dataset;
					if (index) {
						highlightedItem.set(parseInt(index, 10));
					}
				}),
				addEventListener(node, 'click', () => {
					const { index } = node.dataset;
					if (index) {
						const parsedIndex = parseInt(index, 10);
						setSelectedItem(parsedIndex);
						document.getElementById(ids.input)?.focus();
					}
					open.set(false);
				})
			);
			return { destroy: unsub };
		},
	};

	/**
	 * Function to update the list of items in the combobox. It provides the
	 * current items as an argument and expects an updated list in return.
	 *
	 * The updated list is set in both `items` and `filteredItems` stores so
	 * that the filterFunction predicate is applied to any added items. Eg:
	 * ```ts
	 * function addNewBook(book: Book) {
	 *   updateItems((books) => [...books, book]);
	 * };
	 * ```
	 */
	function updateItems(updaterFunction: (currentItems: T[]) => T[]): void {
		const $currentItems = get(items);
		const $inputValue = get(inputValue);
		const $options = get(options);
		// Retrieve the updated list of items from the user-provided function.
		const updatedItems = updaterFunction($currentItems);
		// Update the store containing all items.
		items.set(updatedItems);
		// Run the filter function on the updated list and store the result.
		filteredItems.set(updatedItems.filter((item) => $options.filterFunction(item, $inputValue)));
	}

	return {
		filteredItems: readonly(filteredItems),
		input,
		inputValue: get(inputValue),
		isSelected,
		menu,
		open,
		option,
		options,
		updateItems,
	};
}
