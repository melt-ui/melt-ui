import { getOptions } from '$lib/internal/helpers/list';
import { usePopper } from '@melt-ui/svelte/internal/actions';
import {
	addEventListener,
	effect,
	executeCallbacks,
	FIRST_LAST_KEYS,
	generateId,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	isHTMLInputElement,
	kbd,
	last,
	next,
	noop,
	omit,
	prev,
	sleep,
	styleToString,
} from '@melt-ui/svelte/internal/helpers';
import type { Defaults } from '@melt-ui/svelte/internal/types';
import { tick } from 'svelte';
import { derived, get, readonly, writable } from 'svelte/store';
import type { ComboboxItemArgs, CreateComboboxArgs, CreateComboboxReturn } from './types';

export const INTERACTION_KEYS = [
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.SHIFT,
	kbd.CAPS_LOCK,
	kbd.CONTROL,
	kbd.ALT,
	kbd.META,
	kbd.ENTER,
	kbd.F1,
	kbd.F2,
	kbd.F3,
	kbd.F4,
	kbd.F5,
	kbd.F6,
	kbd.F7,
	kbd.F8,
	kbd.F9,
	kbd.F10,
	kbd.F11,
	kbd.F12,
];

const defaults = {
	scrollAlignment: 'nearest',
	loop: false,
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
} satisfies Defaults<CreateComboboxArgs<unknown>>;

/**
 * POST-PR
 * - Setting initial value
 * - "Fancy" options
 *
 * THONKs
 * - replace updateList with an option setter
 * @TODO support providing an initial selected item
 * @TODO support PAGE_UP/PAGE_DOWN navigation (+10,-10)
 */
export function createCombobox<T>(args: CreateComboboxArgs<T>): CreateComboboxReturn<T> {
	const options = writable(omit({ ...defaults, ...args }, 'items'));
	const open = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted menu item.
	const highlightedItem = writable<HTMLElement | null>(null);
	// The current value of the input element.
	const inputValue = writable('');
	// All items in the menu.
	const items = writable(args.items);
	// A subset of items that match the filterFunction predicate.
	const filteredItems = writable(args.items);
	// The currently selected menu item.
	const selectedItem = writable<T>(undefined);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	/** Re-applies focus to the input element. */
	function focusInput() {
		const inputElement = document.getElementById(ids.input);
		if (!isHTMLElement(inputElement)) return;
		inputElement.focus();
	}

	/** Closes the menu. */
	function closeMenu() {
		open.set(false);
		activeTrigger.set(null);
	}

	/** Opens the menu. */
	function openMenu() {
		const triggerElement = document.getElementById(ids.input);
		if (!isHTMLElement(triggerElement)) return;
		activeTrigger.set(triggerElement);
		open.set(true);
		tick().then(() => {
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) return;
			const selectedItem = menuElement.querySelector('[aria-selected=true]');
			if (!isHTMLElement(selectedItem)) return;
			highlightedItem.set(selectedItem);
		});
	}

	/** Action and attributes for the text input. */
	const input = {
		...derived([open, highlightedItem], ([$open, $highlightedItem]) => {
			return {
				'aria-activedescendant': $highlightedItem?.id,
				'aria-autocomplete': 'list',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-labelledby': ids.label,
				autocomplete: 'off',
				id: ids.input,
				role: 'combobox',
			} as const;
		}),
		action: (node: HTMLInputElement) => {
			const unsubscribe = executeCallbacks(
				// Open the menu portal when the input is focused.
				addEventListener(node, 'focus', () => {
					openMenu();
				}),
				// Handle all input key events including typing, meta, and navigation.
				addEventListener(node, 'keydown', (e) => {
					const $open = get(open);
					const $options = get(options);

					// When the menu is closed...
					if (!$open) {
						// When the user presses `esc` the input should lose focus.
						if (e.key === kbd.ESCAPE) {
							const $selectedItem = get(selectedItem);
							node.blur();
							// If no item is selected the input should be cleared and the filter reset.
							if (!$selectedItem) {
								inputValue.set('');
								filteredItems.set(get(items));
							} else {
								// If an item is selected, the input should be updated to reflect it.
								inputValue.set($options.itemToString($selectedItem));
							}
							return;
						}
						// Pressing one of the interaction keys shouldn't expand the menu.
						if (INTERACTION_KEYS.includes(e.key)) {
							return;
						}
						// Don't open the menu on backspace if the input is blank.
						if (e.key === kbd.BACKSPACE && node.value === '') {
							return;
						}
						// Otherwise, open the menu.
						openMenu();
					}
					// If the menu is open when the user hits `esc`, close it.
					if (e.key === kbd.ESCAPE) {
						closeMenu();
						return;
					}
					// Pressing enter with a highlighted item selects it.
					if (e.key === kbd.ENTER) {
						const $highlightedItem = get(highlightedItem);
						if ($highlightedItem) {
							selectItem($highlightedItem);
						}
						closeMenu();
					}
					// Alt + Up should close the menu if it's open.
					if (e.key === kbd.ARROW_UP && e.altKey) {
						closeMenu();
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
								nextItem = last(candidateNodes);
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
	 * Selects an item from the menu and updates the input value.
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
			const unsubscribeCallbacks = executeCallbacks(
				// Remove highlight when the pointer leaves the item.
				addEventListener(node, 'pointerleave', () => {
					highlightedItem.set(null);
				})
			);
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
					unsubscribeCallbacks();
					unsubPopper();
				},
			};
		},
	};

	/**
	 * Handles moving the `data-highlighted` attribute between items when
	 * the user moves their pointer or navigates with their keyboard.
	 */
	effect([highlightedItem, options], ([$highlightedItem, $options]) => {
		if (!isBrowser) return;
		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) return;
		getOptions(menuElement).forEach((node) => {
			if (node === $highlightedItem) {
				node.setAttribute('data-highlighted', '');
			} else {
				node.removeAttribute('data-highlighted');
			}
		});
		if ($highlightedItem) {
			sleep(1).then(() => $highlightedItem.scrollIntoView({ block: $options.scrollAlignment }));
		}
	});

	const item = {
		...derived([selectedItem], ([$selectedItem]) => (args: ComboboxItemArgs<T>) => ({
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
				// Select an item by clicking on it.
				addEventListener(node, 'click', () => {
					/**
					 * If the item is disabled, don't select it.
					 * The input must be refocused since focus is lost when the item is clicked.
					 * @HACK this approach can definitely be improved.
					 */
					if (isElementDisabled(node)) {
						focusInput();
						return;
					}
					// Otherwise, select the item and close the menu.
					selectItem(node);
					focusInput();
					closeMenu();
				})
			);
			return { destroy: unsubscribe };
		},
	};

	/**
	 * Function to update the items in the combobox. It provides the current
	 * items as an argument and expects an updated list in return.
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
		item,
		options,
		updateItems,
	};
}
