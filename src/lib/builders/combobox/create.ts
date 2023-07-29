import { useEscapeKeydown, usePopper } from '$lib/internal/actions';
import {
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
	overridable,
	prev,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
	addHighlight,
	removeHighlight,
	omit,
	getOptions,
	getPortalParent,
	derivedVisible,
	type MeltEventHandler,
	addMeltEventListener,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { derived, get, readonly, writable } from 'svelte/store';
import type { ComboboxItemProps, CreateComboboxProps } from './types';
import type { Defaults } from '$lib/internal/types';
import type { ActionReturn } from 'svelte/action';
import { createLabel } from '../label/create';

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

const defaults = {
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
	scrollAlignment: 'nearest',
	loop: true,
	defaultOpen: false,
	closeOnOutsideClick: true,
	preventScroll: true,
	closeOnEscape: true,
	portal: 'body',
	forceVisible: false,
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
	const withDefaults = { ...defaults, ...props } satisfies CreateComboboxProps<T>;

	// Either the provided open store or a store with the default open value
	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	// The overridable open store which is the source of truth for the open state.
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	// Trigger element for the popper portal. This will be our input element.
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted menu item.
	const highlightedItem = writable<HTMLElement | null>(null);
	// The current value of the input element.
	const inputValue = writable('');
	// All items in the menu.
	const items = writable(withDefaults.items);
	// A subset of items that match the filterFunction predicate.
	const filteredItems = writable(withDefaults.items);
	// The currently selected menu item.
	const selectedItem = writable<T>(undefined);

	// options
	const options = toWritableStores(omit(withDefaults, 'items'));
	const {
		scrollAlignment,
		loop,
		filterFunction,
		itemToString,
		closeOnOutsideClick,
		closeOnEscape,
		preventScroll,
		portal,
		forceVisible,
		positioning,
	} = options;

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	/** Resets the combobox inputValue and filteredItems back to the selectedItem */
	function reset() {
		const $itemToString = get(itemToString);
		const $selectedItem = get(selectedItem);

		// If no item is selected the input should be cleared and the filter reset.
		if (!$selectedItem) {
			inputValue.set('');
		} else {
			inputValue.set($itemToString($selectedItem));
		}
		// Reset the filtered items to the full list.
		filteredItems.set(get(items));
	}

	/**
	 * Selects an item from the menu and updates the input value.
	 * @param index array index of the item to select.
	 */
	function selectItem(item: HTMLElement) {
		const $itemToString = get(itemToString);
		if (item.dataset.index) {
			const index = parseInt(item.dataset.index, 10);
			const $item = get(filteredItems)[index];
			inputValue.set($itemToString($item));

			selectedItem.set($item);
			// Reset the filtered items to the full list.
			filteredItems.set(get(items));
			const activeTrigger = document.getElementById(ids.input);
			if (activeTrigger) {
				activeTrigger.focus();
			}
		}
	}

	/**
	 * Opens the menu, sets the active trigger, and highlights
	 * the selected item (if one exists). It also optionally accepts the current
	 * open state to prevent unnecessary updates if we know the menu is already open.
	 */
	function openMenu(currentOpenState = false) {
		/**
		 * We're checking the open state here because the menu may have
		 * been programatically opened by the user using a controlled store.
		 * In that case we don't want to update the open state, but we do
		 * want to update the active trigger and highlighted item as normal.
		 */
		if (!currentOpenState) {
			open.set(true);
		}

		const triggerEl = document.getElementById(ids.input);
		if (!triggerEl) return;

		// The active trigger is used to anchor the menu to the input element.
		activeTrigger.set(triggerEl);

		// Wait a tick for the menu to open then highlight the selected item.
		tick().then(() => {
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) return;
			const selectedItem = menuElement.querySelector('[aria-selected=true]');
			if (!isHTMLElement(selectedItem)) return;
			highlightedItem.set(selectedItem);
		});
	}

	/** Closes the menu & clears the active trigger */
	function closeMenu() {
		open.set(false);
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
	 *   updateItems((books) => {
	 *     books.push(book);
	 *     return books
	 * });
	 * };
	 * ```
	 */
	function updateItems(updaterFunction: (currentItems: T[]) => T[]): void {
		const $currentItems = get(items);
		const $inputValue = get(inputValue);
		const $filterFunction = get(filterFunction);
		// Retrieve the updated list of items from the user-provided function.
		const updatedItems = updaterFunction($currentItems);
		// Update the store containing all items.
		items.set(updatedItems);
		// Run the filter function on the updated list and store the result.
		filteredItems.set(updatedItems.filter((item) => $filterFunction(item, $inputValue)));
	}

	type InputEvents = {
		'on:m-click'?: MeltEventHandler<MouseEvent>;
		'on:m-keydown'?: MeltEventHandler<KeyboardEvent>;
		'on:m-input'?: MeltEventHandler<InputEvent>;
	};

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
		action: (node: HTMLInputElement): ActionReturn<unknown, InputEvents> => {
			const unsubscribe = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const $open = get(open);
					if ($open) {
						return;
					}
					openMenu($open);
				}),
				// Handle all input key events including typing, meta, and navigation.
				addMeltEventListener(node, 'keydown', (e) => {
					const $open = get(open);
					/**
					 * When the menu is closed...
					 */
					if (!$open) {
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
						openMenu($open);

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
					if (e.key === kbd.TAB || e.key === kbd.ESCAPE) {
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
						const $loop = get(loop);
						const $scrollAlignment = get(scrollAlignment);
						let nextItem: HTMLElement;
						switch (e.key) {
							case kbd.ARROW_DOWN:
								nextItem = next(candidateNodes, currentIndex, $loop);
								break;
							case kbd.ARROW_UP:
								nextItem = prev(candidateNodes, currentIndex, $loop);
								break;
							case kbd.PAGE_DOWN:
								nextItem = forward(candidateNodes, currentIndex, 10, $loop);
								break;
							case kbd.PAGE_UP:
								nextItem = back(candidateNodes, currentIndex, 10, $loop);
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
						nextItem.scrollIntoView({ block: $scrollAlignment });
					}
				}),
				// Listens to the input value and filters the items accordingly.
				addMeltEventListener(node, 'input', (e) => {
					if (!isHTMLInputElement(e.target)) return;
					const $filterFunction = get(filterFunction);
					const $items = get(items);
					const value = e.target.value;
					inputValue.set(value);
					filteredItems.set($items.filter((item) => $filterFunction(item, value)));
				})
			);

			let unsubEscapeKeydown = noop;

			effect(open, ($open) => {
				if ($open) {
					tick().then(() => {
						const escape = useEscapeKeydown(node, {
							handler: () => {
								closeMenu();
							},
						});
						if (escape && escape.destroy) {
							unsubEscapeKeydown = escape.destroy;
						}
					});
				} else {
					unsubEscapeKeydown();
				}
			});

			return {
				destroy() {
					unsubscribe();
					unsubEscapeKeydown();
				},
			};
		},
	});

	type MenuEvents = {
		'on:pointerleave'?: MeltEventHandler<PointerEvent>;
	};

	onMount(() => {
		activeTrigger.set(document.getElementById(ids.input));
	});

	/**
	 * To properly anchor the popper to the input/trigger, we need to ensure both
	 * the open state is true and the activeTrigger is not null. This helper store's
	 * value is true when both of these conditions are met and keeps the code tidy.
	 */
	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	/**
	 * Action and attributes for the menu element.
	 */
	const menu = builder(name('menu'), {
		stores: [isVisible],
		returned: ([$isVisible]) => {
			return {
				hidden: $isVisible ? undefined : true,
				id: ids.menu,
				role: 'listbox',
				style: styleToString({ display: $isVisible ? undefined : 'none' }),
			} as const;
		},
		action: (node: HTMLElement): ActionReturn<unknown, MenuEvents> => {
			/**
			 * We need to get the parent portal before the menu is opened,
			 * otherwise the parent will have been moved to the body, and
			 * will no longer be an ancestor of this node.
			 */
			const portalParent = getPortalParent(node);
			let unsubPopper = noop;
			let unsubScroll = noop;
			const unsubscribe = executeCallbacks(
				//  Bind the popper portal to the input element.
				effect(
					[isVisible, preventScroll, closeOnEscape, portal, closeOnOutsideClick, positioning],
					([
						$isVisible,
						$preventScroll,
						$closeOnEscape,
						$portal,
						$closeOnOutsideClick,
						$positioning,
					]) => {
						unsubPopper();
						unsubScroll();
						const $activeTrigger = get(activeTrigger);
						if (!($isVisible && $activeTrigger)) return;
						if ($preventScroll) {
							unsubScroll = removeScroll();
						}

						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: $positioning,
									focusTrap: null,
									clickOutside: $closeOnOutsideClick
										? {
												handler: (e) => {
													const target = e.target;
													if (target === $activeTrigger) return;
													closeMenu();
													reset();
												},
										  }
										: null,
									escapeKeydown: $closeOnEscape
										? {
												handler: () => {
													closeMenu();
												},
										  }
										: null,
									portal: $portal ? (portalParent === $portal ? portalParent : $portal) : null,
								},
							});
							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				),
				// Remove highlight when the pointer leaves the menu.
				addMeltEventListener(node, 'pointerleave', () => {
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

	type ItemEvents = {
		'on:pointermove'?: MeltEventHandler<PointerEvent>;
		'on:click'?: MeltEventHandler<MouseEvent>;
	};

	// Use our existing label builder to create a label for the combobox input.
	const {
		elements: { root: labelBuilder },
	} = createLabel();
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
		action: (node: HTMLElement): ActionReturn<unknown, ItemEvents> => {
			const unsubscribe = executeCallbacks(
				// Handle highlighting items when the pointer moves over them.
				addMeltEventListener(node, 'pointermove', () => {
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
				addMeltEventListener(node, 'click', (e) => {
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
	effect([highlightedItem, scrollAlignment], ([$highlightedItem, $scrollAlignment]) => {
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
			sleep(1).then(() => $highlightedItem.scrollIntoView({ block: $scrollAlignment }));
		}
	});

	return {
		elements: {
			input,
			item,
			menu,
			label,
		},
		states: {
			open,
			inputValue,
			filteredItems: readonly(filteredItems),
			selectedItem,
		},
		helpers: {
			updateItems,
			isSelected,
		},
		options,
	};
}
