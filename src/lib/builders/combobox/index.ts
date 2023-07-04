import { usePopper, type FloatingConfig } from '@melt-ui/svelte/internal/actions';
import {
	FIRST_LAST_KEYS,
	addEventListener,
	effect,
	executeCallbacks,
	generateId,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	isHTMLInputElement,
	kbd,
	next,
	noop,
	omit,
	prev,
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
	itemToString: (item: T) => string;
	loop?: boolean;
	positioning?: FloatingConfig;
}

interface OptionArgs<T> {
	item: T;
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
	option: Readable<(args: OptionArgs<T>) => HTMLLiAttributes> & {
		action: Action<HTMLLIElement, void>;
	};
	/** Top-level configuration for the Combobox instance. */
	options: Writable<Omit<CreateComboboxArgs<T>, 'items'>>;
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
 * BUGS
 * - Tab navigation
 * - Menu should re-expand after item selection. (Select an item and press backspace)
 * - Option+up should close the menu
 * - Option+down should open the menu
 * - Be able to disable the input via a `disabled` attribute on the input as well as the builder.
 * - Cursor management on the chevron when disabled.
 *
 * POST-PR
 * - Setting initial value
 * - "Fancy" options
 * - Empty state
 * - PAGE_UP / PAGE_DOWN
 *
 * THONKs
 * - replace updateList with an option setter
 */
export function createCombobox<T>(args: CreateComboboxArgs<T>): Combobox<T> {
	const options = writable(omit({ ...defaults, ...args }, 'items'));
	const open = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted list item
	const highlightedItem = writable<HTMLElement | null>(null);
	// The current value of the input element.
	const inputValue = writable('');
	// All items in the list.
	const items = writable(args.items);
	// A subset of items that match the filterFunction predicate.
	const filteredItems = writable(args.items);
	// The currently selected list item.
	const selectedItem = writable<T>(undefined);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	/** Closes the menu. */
	function closePanel() {
		open.set(false);
		activeTrigger.set(null);
	}

	function openPanel() {
		const triggerElement = document.getElementById(ids.input);
		if (!isHTMLElement(triggerElement)) return;
		activeTrigger.set(triggerElement);
		open.set(true);
	}

	/** Retrieves all option descendants of a given element. */
	function getOptions(element: HTMLElement): HTMLElement[] {
		return Array.from(element.querySelectorAll('[role="option"]'));
	}

	/** Action and attributes for the text input. */
	const input = {
		...derived([open, options, highlightedItem], ([$open, $options, $highlightedItem]) => {
			return {
				'aria-activedescendant': $highlightedItem?.id,
				'aria-autocomplete': 'list',
				'aria-controls': ids.menu,
				'aria-disabled': $options.disabled ? true : undefined,
				'aria-expanded': $open,
				'aria-labelledby': ids.label,
				autocomplete: 'off',
				disabled: $options.disabled,
				id: ids.input,
				role: 'combobox',
			} as const;
		}),
		action: (node: HTMLInputElement) => {
			const unsubscribe = executeCallbacks(
				// Open the menu portal when the input is focused.
				addEventListener(node, 'focus', () => {
					const triggerElement = document.getElementById(ids.input);
					if (!isHTMLElement(triggerElement)) return;
					activeTrigger.set(triggerElement);
					openPanel();
				}),
				// Handle all input key events including typing, meta, and navigation.
				addEventListener(node, 'keydown', (e) => {
					const $open = get(open);
					// When the menu is closed...
					if (!$open) {
						if (e.altKey || e.metaKey || e.ctrlKey) {
							return;
						}

						// When the user presses `esc` the input should lose focus.
						if (e.key === kbd.ESCAPE) {
							node.blur();
							// If no item is selected the input should also be cleared.
							if (!get(selectedItem)) {
								inputValue.set('');
							}
							return;
						}
						// Don't open the menu on backspace if the input is blank.
						if (e.key === kbd.BACKSPACE && node.value === '') {
							return;
						}
						// Otherwise, open the menu.
						openPanel();
					}
					// If the menu is open when the user hits `esc`, close it.
					if (e.key === kbd.ESCAPE) {
						closePanel();
						return;
					}
					// Pressing enter with a highlighted item selects it.
					if (e.key === kbd.ENTER) {
						const $highlightedItem = get(highlightedItem);
						if ($highlightedItem) {
							selectItem($highlightedItem);
						}
						closePanel();
					}
					if (e.key === kbd.TAB) {
						closePanel();
					}
					// Navigation events.
					if (FIRST_LAST_KEYS.includes(e.key)) {
						e.preventDefault();
						// Get all the menu items.
						const menuElement = document.getElementById(ids.menu);
						if (!isHTMLElement(menuElement)) return;
						const itemElements = getOptions(menuElement);
						if (!itemElements.length) return;

						// Disabled items can't be highlighted. Skip them.
						const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt));

						// Get the index of the currently highlighted item.
						const $currentItem = get(highlightedItem);
						const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;

						// Calculate the index of the next menu item to highlight.
						const $options = get(options);
						const loop = $options.loop;
						let nextItem: HTMLElement | undefined;

						/** @TODO support PAGE_UP/PAGE_DOWN navigation (+10,-10) */
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
				// Listens to the input value and filters the items accordingly.
				addEventListener(node, 'input', (e) => {
					if (!isHTMLInputElement(e.target)) return;
					const $options = get(options);
					const $items = get(items);
					const value = e.target.value;
					inputValue.set(value);
					filteredItems.set($items.filter((item) => $options.filterFunction(item, value)));
				})
			);
			return { destroy: unsubscribe };
		},
	};

	/**
	 * Selects an item in the list and updates the input value.
	 * @param index array index of the item to select.
	 */
	function selectItem(item: HTMLElement) {
		const $options = get(options);
		if (item.dataset.index) {
			const index = parseInt(item.dataset.index, 10);
			const $item = get(filteredItems)[index];
			inputValue.set($options.itemToString($item));
			selectedItem.set($item);
		}
	}

	/**
	 * Determines if a given item is selected.
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
			style: styleToString({ display: $open ? undefined : 'none' }),
		})),
		action: (node: HTMLUListElement) => {
			let unsubPopper = noop;
			const unsubscribe = effect(
				[open, activeTrigger, options],
				([$open, $activeTrigger, $options]) => {
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: { floating: $options.positioning, focusTrap: null },
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
					unsubscribe();
					unsubPopper();
				},
			};
		},
	};

	/**
	 * Handles moving the `data-highlighted` attribute between items when
	 * the user moves their pointer or navigates with their keyboard.
	 */
	effect(highlightedItem, ($highlightedItem) => {
		if (!isBrowser) return;
		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) return;
		menuElement.querySelectorAll('[role="option"]').forEach((node) => {
			if (node === $highlightedItem) {
				node.setAttribute('data-highlighted', '');
			} else {
				node.removeAttribute('data-highlighted');
			}
		});
	});

	effect([open, options], ([$open, $options]) => {
		if (!isBrowser) return;

		const menuElement = document.getElementById(ids.menu);
		if (menuElement && $open) {
			// @FIXME
			// Focus on selected option or first option
			const selectedOption = menuElement.querySelector('[data-highlighted]');
			if (selectedOption) {
				sleep(1).then(() => selectedOption.scrollIntoView({ block: $options.scrollAlignment }));
			}
		}
	});

	const option = {
		...derived([selectedItem], ([$selectedItem]) => (args: OptionArgs<T>) => ({
			'aria-disabled': args.disabled ? true : undefined,
			'aria-selected': args.item === $selectedItem,
			'data-index': args.index,
			id: `${ids.input}-descendent-${args.index}`,
			role: 'option',
			style: styleToString({ cursor: args.disabled ? 'default' : 'pointer' }),
		})),
		action: (node: HTMLLIElement) => {
			const unsubscribe = executeCallbacks(
				// Handle highlighting items when the pointer moves over them.
				addEventListener(node, 'pointermove', () => {
					// Don't highlight disabled items.
					if (isElementDisabled(node)) return;
					// Skip highlighting if the item is already highlighted.
					if (node === get(highlightedItem)) return;
					highlightedItem.set(node);
				}),
				// Remove highlight when the pointer leaves the item.
				addEventListener(node, 'pointerleave', () => {
					highlightedItem.set(null);
				}),
				// Select an item by clicking on it.
				addEventListener(node, 'click', () => {
					selectItem(node);
					// Re-focus the input since focus is lost when clicking the item.
					const inputElement = document.getElementById(ids.input);
					if (!isHTMLElement(inputElement)) return;
					inputElement.focus();
					closePanel();
				})
			);
			return { destroy: unsubscribe };
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
