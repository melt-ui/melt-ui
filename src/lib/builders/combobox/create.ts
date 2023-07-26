import { usePopper } from '$lib/internal/actions';
import {
	addEventListener,
	back,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	FIRST_LAST_KEYS,
	forward,
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
	removeScroll,
	sleep,
	styleToString,
	addHighlight,
	removeHighlight,
} from '$lib/internal/helpers';
import { getOptions } from '$lib/internal/helpers/list';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, readonly, writable } from 'svelte/store';
import type { ComboboxItemProps, CreateComboboxProps } from './types';
import { createLabel } from '../label';

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

const defaults = {
	scrollAlignment: 'nearest',
	loop: true,
} satisfies Defaults<CreateComboboxProps<unknown>>;

const { name, selector } = createElHelpers('combobox');

/**
 * Creates an ARIA-1.2-compliant combobox.
 *
 * @TODO support providing an initial selected item
 * @TODO expose a nice mechanism for clearing the input.
 * @TODO would it be useful to have a callback for when an item is selected?
 * @TODO multi-select using `tags-input` builder?
 */
export function createCombobox<T>(props: CreateComboboxProps<T>) {
	const options = writable(omit({ ...defaults, ...props }, 'items'));
	const open = writable(false);
	// Trigger element for the popper portal. This will be our input element.
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted menu item.
	const highlightedItem = writable<HTMLElement | null>(null);
	// The current value of the input element.
	const inputValue = writable('');
	// All items in the menu.
	const items = writable(props.items);
	// A subset of items that match the filterFunction predicate.
	const filteredItems = writable(props.items);
	// The currently selected menu item.
	const selectedItem = writable<T>(undefined);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

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
		// Wait a tick for the menu to open then highlight the selected item.
		tick().then(() => {
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) return;
			const selectedItem = menuElement.querySelector('[aria-selected=true]');
			if (!isHTMLElement(selectedItem)) return;
			highlightedItem.set(selectedItem);
		});
	}

	/** Resets the combobox inputValue and filteredItems back to the selectedItem */
	function reset() {
		const $options = get(options);
		const $selectedItem = get(selectedItem);

		// If no item is selected the input should be cleared and the filter reset.
		if (!$selectedItem) {
			inputValue.set('');
		} else {
			inputValue.set($options.itemToString($selectedItem));
		}
		// Reset the filtered items to the full list.
		filteredItems.set(get(items));
	}

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
			// Reset the filtered items to the full list.
			filteredItems.set(get(items));
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

	/** Action and attributes for the text input. */
	const input = builder(name('input'), {
		stores: [open, highlightedItem],
		returned: ([$open, $highlightedItem]) => {
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
		},
		action: (node: HTMLInputElement) => {
			const unsubscribe = executeCallbacks(
				addEventListener(node, 'click', () => {
					openMenu();
				}),
				// Handle all input key events including typing, meta, and navigation.
				addEventListener(node, 'keydown', (e) => {
					const $open = get(open);
					const $options = get(options);
					/**
					 * When the menu is closed...
					 */
					if (!$open) {
						// Pressing `esc` should blur the input.
						if (e.key === kbd.ESCAPE) {
							node.blur();
							return;
						}
						// Pressing one of the interaction keys shouldn't open the menu.
						if (INTERACTION_KEYS.includes(e.key)) {
							return;
						}

						// Tab should not open the menu.
						if (e.key === kbd.TAB) {
							return;
						}

						// Pressing backspace when the input is blank shouldn't open the menu.
						if (e.key === kbd.BACKSPACE && node.value === '') {
							return;
						}

						// All other events should open the menu.
						openMenu();

						tick().then(() => {
							const $selectedItem = get(selectedItem);
							if ($selectedItem) return;

							const menuEl = document.getElementById(ids.menu);
							if (!isHTMLElement(menuEl)) return;

							const enabledItems = Array.from(
								menuEl.querySelectorAll(`${selector('item')}:not([data-disabled])`)
							).filter((item): item is HTMLElement => isHTMLElement(item));
							if (!enabledItems.length) return;

							if (e.key === kbd.ARROW_DOWN) {
								highlightedItem.set(enabledItems[0]);
							} else if (e.key === kbd.ARROW_UP) {
								highlightedItem.set(last(enabledItems));
							}
						});
					}
					/**
					 * When the menu is open...
					 */
					// Pressing `esc` should close the menu.
					if (e.key === kbd.ESCAPE || e.key === kbd.TAB) {
						closeMenu();
						reset();
						return;
					}
					// Pressing enter with a highlighted item should select it.
					if (e.key === kbd.ENTER) {
						const $highlightedItem = get(highlightedItem);
						if ($highlightedItem) {
							selectItem($highlightedItem);
						}
						closeMenu();
					}
					// Pressing Alt + Up should close the menu.
					if (e.key === kbd.ARROW_UP && e.altKey) {
						closeMenu();
					}
					// Navigation (up, down, etc.) should change the highlighted item.
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
						// Find the next menu item to highlight.
						const loop = $options.loop;
						let nextItem: HTMLElement;
						switch (e.key) {
							case kbd.ARROW_DOWN:
								nextItem = next(candidateNodes, currentIndex, loop);
								break;
							case kbd.PAGE_DOWN:
								nextItem = forward(candidateNodes, currentIndex, 10, loop);
								break;
							case kbd.ARROW_UP:
								nextItem = prev(candidateNodes, currentIndex, loop);
								break;
							case kbd.PAGE_UP:
								nextItem = back(candidateNodes, currentIndex, 10, loop);
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
	});

	/**
	 * Action and attributes for the menu element.
	 */
	const menu = builder(name('menu'), {
		stores: [open],
		returned: ([$open]) =>
			({
				hidden: $open ? undefined : true,
				id: ids.menu,
				role: 'listbox',
				style: styleToString({ display: $open ? undefined : 'none' }),
			} as const),
		action: (node: HTMLElement) => {
			let unsubPopper = noop;
			let unsubScroll = noop;
			const unsubscribe = executeCallbacks(
				//  Bind the popper portal to the input element.
				effect([open, activeTrigger], ([$open, $activeTrigger]) => {
					unsubPopper();
					unsubScroll();
					if ($open && $activeTrigger) {
						unsubScroll = removeScroll();
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: { placement: 'bottom', sameWidth: true },
									focusTrap: null,
									clickOutside: {
										handler: (e) => {
											const target = e.target;
											if (isHTMLElement(target)) {
												const closestLabel = target.closest(selector('label'));
												const isTrigger = target === $activeTrigger;
												const isLabel = target.id === ids.label;
												if (closestLabel || isTrigger || isLabel) {
													return;
												}
											}
											reset();
											closeMenu();
										},
									},
								},
							});
							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				}),
				// Remove highlight when the pointer leaves the menu.
				addEventListener(node, 'pointerleave', () => {
					highlightedItem.set(null);
				})
			);
			return {
				destroy: () => {
					unsubscribe();
					unsubPopper();
					unsubScroll();
				},
			};
		},
	});

	// Use our existing label builder to create a label for the combobox input.
	const labelBuilder = createLabel();
	const { action: labelAction } = get(labelBuilder);

	const label = builder(name('label'), {
		returned: () => {
			return {
				id: ids.label,
				for: ids.input,
			};
		},
		action: labelAction,
	});

	const item = builder(name('item'), {
		stores: [selectedItem],
		returned:
			([$selectedItem]) =>
			(props: ComboboxItemProps<T>) =>
				({
					'data-disabled': props.disabled ? '' : undefined,
					'aria-disabled': props.disabled ? true : undefined,
					'aria-selected': props.item === $selectedItem,
					'data-index': props.index,
					id: `${ids.input}-descendent-${props.index}`,
					role: 'option',
					style: styleToString({ cursor: props.disabled ? 'default' : 'pointer' }),
				} as const),
		action: (node: HTMLElement) => {
			const unsubscribe = executeCallbacks(
				// Handle highlighting items when the pointer moves over them.
				addEventListener(node, 'pointermove', () => {
					// Skip highlighting if the item is already highlighted.
					if (node === get(highlightedItem)) return;
					// If the item is disabled, clear the highlight.
					if (isElementDisabled(node)) {
						highlightedItem.set(null);
						return;
					}
					// Otherwise, proceed.
					highlightedItem.set(node);
				}),
				addEventListener(node, 'click', (e) => {
					e.stopPropagation();
					// If the item is disabled, `preventDefault` to stop the input losing focus.
					if (isElementDisabled(node)) {
						e.preventDefault();
						return;
					}
					// Otherwise, select the item and close the menu.
					selectItem(node);
					closeMenu();
				})
			);
			return { destroy: unsubscribe };
		},
	});

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
				addHighlight(node);
			} else {
				removeHighlight(node);
			}
		});
		if ($highlightedItem) {
			sleep(1).then(() => $highlightedItem.scrollIntoView({ block: $options.scrollAlignment }));
		}
	});

	return {
		filteredItems: readonly(filteredItems),
		updateItems,
		inputValue,
		isSelected,
		selectedItem,
		options,
		open,
		menu,
		input,
		item,
		label,
	};
}
