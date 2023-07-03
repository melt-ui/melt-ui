import { usePopper, type FloatingConfig } from '@melt-ui/svelte/internal/actions';
import {
	addEventListener,
	effect,
	executeCallbacks,
	generateId,
	isBrowser,
	isHTMLElement,
	kbd,
	next,
	noop,
	prev,
	sleep,
	styleToString,
} from '@melt-ui/svelte/internal/helpers';
import type { Defaults } from '@melt-ui/svelte/internal/types';
import { tick } from 'svelte';
import type { Action } from 'svelte/action';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLiAttributes } from 'svelte/elements';
import { derived, get, readonly, writable, type Readable, type Writable } from 'svelte/store';

const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

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
	itemToString: (item: T) => string;
	loop?: boolean;
	positioning?: FloatingConfig;
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
	inputValue: Writable<string>;
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
	loop: false,
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
} satisfies Defaults<CreateComboboxArgs<unknown>>;

/**
 * TODOS
 *  - Aria selection for options.
 *
 * BUGS
 * - all items disabled—first is highlighted
 * - Tab navigation
 *
 * POLISH PASS
 * - Omit the `items` from the $options store
 * - Naming of variables, etc.
 * - Add item selection data attributes from `select`
 *
 * POST-PR
 * - Setting initial value
 * - "Fancy" options
 * - Empty state
 * - PAGE_UP / PAGE_DOWN
 *
 * THONKs
 *  - replace updateList with an option setter
 */
export function createCombobox<T>(args: CreateComboboxArgs<T>): Combobox<T> {
	const options = writable<CreateComboboxArgs<T>>({ ...defaults, ...args });
	const open = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);
	const selectedItem = writable<T>(undefined);
	// The currently highlighted list item
	const highlightedItem = writable<HTMLElement | null>(null);
	// The current value of the input element.
	const inputValue = writable('');
	// All items in the list.
	const items = writable(args.items);
	// A subset of items that match the filterFunction predicate.
	const filteredItems = writable(args.items);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	function getOptions(element: HTMLElement): HTMLElement[] {
		return Array.from(element.querySelectorAll('[role="option"]'));
	}

	/** Determines if an option is disabled.*/
	function isDisabled(node: HTMLElement) {
		return node.hasAttribute('data-disabled') || node.getAttribute('disabled') === 'true';
	}

	/**
	 * Action and attributes for the text input element.
	 */
	const input = {
		...derived([open, options, highlightedItem], ([$open, $options, $highlightedItem]) => {
			return {
				'aria-activedescendant': $highlightedItem?.id,
				'aria-autocomplete': 'list',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-labelledby': ids.label,
				'data-disabled': $options.disabled ? true : undefined,
				autocomplete: 'off',
				disabled: $options.disabled,
				id: ids.input,
				role: 'combobox',
			} as const;
		}),
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
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
						/**
						 * When the user presses `esc` the input should lose focus.
						 * If no item is selected the input should also be cleared.
						 */
						if (e.key === kbd.ESCAPE) {
							node.blur();
							if (!get(selectedItem)) {
								inputValue.set('');
							}
							return;
						}
						// Don't open the menu on backspace if the input is blank.
						if (e.key === kbd.BACKSPACE && node.value === '') {
							return;
						}
						// Otherwise, open the input.
						open.set(true);
					}

					// If the menu is open when the user hits `esc`, close it.
					if (e.key === kbd.ESCAPE) {
						open.set(false);
						activeTrigger.set(null);
						return;
					}
					// 	case kbd.ENTER: {
					// 		const $highlightedIndex = get(highlightedIndex);
					// 		selectItem($highlightedIndex);
					// 		open.set(false);
					// 		break;
					// 	}

					// if (e.key === kbd.TAB) {
					// 	e.preventDefault();
					// 	activeTrigger.set(null);
					// 	open.set(false);
					// 	// handleTabNavigation(e);
					// }

					// Navigation events.
					if (FIRST_LAST_KEYS.includes(e.key)) {
						e.preventDefault();

						// Get all the menu items.
						const menuEl = document.getElementById(ids.menu);
						if (!isHTMLElement(menuEl)) return;
						const items = getOptions(menuEl);
						if (!items.length) return;

						// Disabled items can't be highlighted. Skip them.
						const candidateNodes = items.filter((opt) => !isDisabled(opt));

						// Get the index of the currently highlighted item.
						const $currentItem = get(highlightedItem);
						const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;

						// Calculate the index of the next menu item to highlight.
						const $options = get(options);
						const loop = $options.loop;
						let nextItem: HTMLElement | undefined;

						switch (e.key) {
							case kbd.ARROW_DOWN:
								nextItem = next(candidateNodes, currentIndex, loop);
								break;
							case kbd.ARROW_UP:
								nextItem = prev(candidateNodes, currentIndex, loop);
								break;
							case kbd.HOME:
								nextItem = candidateNodes[0];
								break;
							case kbd.END:
								nextItem = candidateNodes[candidateNodes.length - 1];
								break;
							default:
								return;
						}

						/**
						 * Bail if `next` or `prev` return `undefined`.
						 * Theoretically this shouldn't be possible but it's a good check anyway.
						 */
						if (typeof nextItem === 'undefined') return;

						// Highlight the new item and scroll it into view.
						highlightedItem.set(nextItem);
						nextItem.scrollIntoView({ block: $options.scrollAlignment });
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
	 * Selects an item in the list and updates the input value.
	 * @param index array index of the item to select.
	 */
	function selectItem(index: number) {
		const $options = get(options);
		const $item = get(filteredItems)[index];
		selectedItem.set($item);
		inputValue.set($options.itemToString($item));
	}

	/**
	 * Function to determine if a given item is selected.
	 * This is useful for displaying additional markup on the selected item.
	 */
	const isSelected = derived([selectedItem], ([$selectedItem]) => {
		return (item: T) => $selectedItem === item;
	});

	/**
	 * Action and attributes for the menu element.
	 */
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
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
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
			return {
				destroy: () => {
					unsubDerived();
					unsubPopper();
				},
			};
		},
	};

	effect(highlightedItem, ($highlightedItem) => {
		if (!isBrowser) return;

		const menuEl = document.getElementById(ids.menu);
		if (!isHTMLElement(menuEl)) return;
		menuEl.querySelectorAll('[role="option"]').forEach((node) => {
			if (node === $highlightedItem) {
				node.setAttribute('data-highlighted', '');
			} else {
				node.removeAttribute('data-highlighted');
			}
		});
	});

	effect([open, options], ([$open, $options]) => {
		if (!isBrowser) return;

		const menuEl = document.getElementById(ids.menu);
		if (menuEl && $open) {
			// @FIXME
			// Focus on selected option or first option
			const selectedOption = menuEl.querySelector('[data-highlighted]');
			if (selectedOption) {
				sleep(1).then(() => selectedOption.scrollIntoView({ block: $options.scrollAlignment }));
			}
		}
	});

	const option = {
		...derived([selectedItem], ([$selectedItem]) => (args: OptionArgs) => ({
			// @FIXME
			// 'aria-selected': $value === args?.value,
			// 'data-selected': $value === args?.value ? '' : undefined,
			'data-disabled': args.disabled ? true : undefined,
			'data-index': args.index,
			role: 'option',
			id: `${ids.input}-descendent-${args.index}`,
		})),
		action: (node: HTMLLIElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'pointermove', () => {
					if (isDisabled(node)) return;
					if (node === get(highlightedItem)) return;
					highlightedItem.set(node);
				}),
				addEventListener(node, 'pointerleave', () => {
					highlightedItem.set(null);
				}),
				addEventListener(node, 'click', () => {
					const { index } = node.dataset;
					if (index) {
						const parsedIndex = parseInt(index, 10);
						selectItem(parsedIndex);
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
		inputValue,
		isSelected,
		menu,
		open,
		option,
		options,
		updateItems,
	};
}
