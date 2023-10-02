import { useEscapeKeydown, usePopper } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	addHighlight,
	addMeltEventListener,
	back,
	builder,
	createClickOutsideIgnore,
	createElHelpers,
	derivedVisible,
	disabledAttr,
	effect,
	executeCallbacks,
	forward,
	generateId,
	getElementByMeltId,
	getOptions,
	getPortalDestination,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	isHTMLInputElement,
	isHidden,
	kbd,
	last,
	next,
	noop,
	omit,
	overridable,
	prev,
	removeHighlight,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
	toggle,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { dequal as deepEqual } from 'dequal';
import { onMount, tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import { createLabel } from '../label/create.js';
import type { ComboboxEvents } from './events.js';
import type {
	ComboboxItemProps,
	ComboboxOption,
	ComboboxSelected,
	CreateComboboxProps,
} from './types.js';

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

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
	forceVisible: false,
	portal: undefined,
} satisfies Defaults<CreateComboboxProps<unknown>>;

const { name, selector } = createElHelpers('combobox');

/**
 * Creates an ARIA-1.2-compliant combobox.
 *
 * @TODO expose a nice mechanism for clearing the input.
 * @TODO would it be useful to have a callback for when an item is selected?
 * @TODO multi-select using `tags-input` builder?
 */
export function createCombobox<
	Value,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
>(props?: CreateComboboxProps<Value, Multiple, S>) {
	const withDefaults = { ...defaults, ...props } satisfies CreateComboboxProps<Value, Multiple, S>;

	// Trigger element for the popper portal. This will be our input element.
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted menu item.
	const highlightedItem = writable<HTMLElement | null>(null);

	const selectedWritable =
		withDefaults.selected ?? writable<S | undefined>(withDefaults.defaultSelected);

	const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);

	const highlighted = derived(highlightedItem, ($highlightedItem) =>
		$highlightedItem ? getOptionProps($highlightedItem) : undefined
	) as Readable<ComboboxOption<Value> | undefined>;

	// The current value of the input element.
	const inputValue = writable(
		Array.isArray(withDefaults.defaultSelected) ? '' : withDefaults.defaultSelected?.label ?? ''
	);

	// Either the provided open store or a store with the default open value
	const openWritable = withDefaults.open ?? writable(false);
	// The overridable open store which is the source of truth for the open state.
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const options = toWritableStores({
		...omit(withDefaults, 'open', 'defaultOpen'),
		multiple: withDefaults.multiple ?? (false as Multiple),
	});

	const {
		scrollAlignment,
		loop,
		closeOnOutsideClick,
		closeOnEscape,
		preventScroll,
		portal,
		forceVisible,
		positioning,
		multiple,
	} = options;

	const touchedInput = writable(false);
	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	/** ------- */
	/** HELPERS */
	/** ------- */
	function getOptionProps(el: HTMLElement): ComboboxItemProps<Value> {
		const value = el.getAttribute('data-value');
		const label = el.getAttribute('data-label');
		const disabled = el.hasAttribute('data-disabled');

		return {
			value: value ? JSON.parse(value) : value,
			label: label ?? el.textContent ?? undefined,
			disabled: disabled ? true : false,
		};
	}

	/** Resets the combobox inputValue and filteredItems back to the selectedItem */
	function reset() {
		const $selectedItem = get(selected);

		// If no item is selected the input should be cleared and the filter reset.
		if (!$selectedItem || Array.isArray($selectedItem)) {
			inputValue.set('');
		} else {
			inputValue.set($selectedItem?.label ?? '');
		}

		touchedInput.set(false);
	}

	const setOption = (newOption: ComboboxOption<Value>) => {
		selected.update(($option) => {
			const $multiple = get(multiple);
			if ($multiple) {
				const optionArr = Array.isArray($option) ? $option : [];
				return toggle(newOption, optionArr) as S;
			}
			return newOption as S;
		});
	};

	/**
	 * Selects an item from the menu and updates the input value.
	 * @param index array index of the item to select.
	 */
	function selectItem(item: HTMLElement) {
		const props = getOptionProps(item);

		setOption(props);

		if (!get(multiple)) {
			inputValue.set(props.label ?? '');
		}
	}

	/**
	 * Opens the menu, sets the active trigger, and highlights
	 * the selected item (if one exists). It also optionally accepts the current
	 * open state to prevent unnecessary updates if we know the menu is already open.
	 */
	async function openMenu(currentOpenState = false) {
		/**
		 * We're checking the open state here because the menu may have
		 * been programatically opened by the user using a controlled store.
		 * In that case we don't want to update the open state, but we do
		 * want to update the active trigger and highlighted item as normal.
		 */
		if (!currentOpenState) {
			open.set(true);
		}

		const triggerEl = getElementByMeltId(ids.input);
		if (!triggerEl) return;

		// The active trigger is used to anchor the menu to the input element.
		activeTrigger.set(triggerEl);

		// Wait a tick for the menu to open then highlight the selected item.
		await tick();

		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) return;

		const selectedItem = menuElement.querySelector('[aria-selected=true]');
		if (!isHTMLElement(selectedItem)) return;
		highlightedItem.set(selectedItem);
	}

	/** Closes the menu & clears the active trigger */
	function closeMenu() {
		open.set(false);
		touchedInput.set(false);
	}

	/**
	 * To properly anchor the popper to the input/trigger, we need to ensure both
	 * the open state is true and the activeTrigger is not null. This helper store's
	 * value is true when both of these conditions are met and keeps the code tidy.
	 */
	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	/**
	 * Determines if a given item is selected.
	 * This is useful for displaying additional markup on the selected item.
	 */
	const isSelected = derived([selected], ([$selected]) => {
		return (value: Value) => {
			if (Array.isArray($selected)) {
				return $selected.some((o) => deepEqual(o.value, value));
			}
			return deepEqual($selected?.value, value);
		};
	});

	/**
	 * Determines if a given item is highlighted.
	 * This is useful for displaying additional markup on the highlighted item.
	 */
	const isHighlighted = derived([highlighted], ([$value]) => {
		return (item: Value) => {
			return deepEqual($value?.value, item);
		};
	});

	/** -------- */
	/** ELEMENTS */
	/** -------- */

	/** Action and attributes for the text input. */
	const input = builder(name('input'), {
		stores: [open, highlightedItem, inputValue],
		returned: ([$open, $highlightedItem, $inputValue]) => {
			return {
				'aria-activedescendant': $highlightedItem?.id,
				'aria-autocomplete': 'list',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-labelledby': ids.label,
				'data-melt-id': ids.input,
				autocomplete: 'off',
				id: ids.input,
				role: 'combobox',
				value: $inputValue,
			} as const;
		},
		action: (node: HTMLInputElement): MeltActionReturn<ComboboxEvents['input']> => {
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
							const $selectedItem = get(selected);
							if ($selectedItem) return;

							const menuEl = document.getElementById(ids.menu);
							if (!isHTMLElement(menuEl)) return;

							const enabledItems = Array.from(
								menuEl.querySelectorAll(
									`${selector('item')}:not([data-disabled]):not([data-hidden])`
								)
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
						e.preventDefault();
						const $highlightedItem = get(highlightedItem);
						if ($highlightedItem) {
							selectItem($highlightedItem);
						}
						closeMenu();
					}
					// Pressing Alt + Up should close the menu.
					if (e.key === kbd.ARROW_UP && e.altKey) {
						closeMenu();
						reset();
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
						const candidateNodes = itemElements.filter(
							(opt) => !isElementDisabled(opt) && opt.dataset.hidden === undefined
						);
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
					const value = e.target.value;
					inputValue.set(value);
					touchedInput.set(true);

					tick().then(() => {
						const $highlightedItem = get(highlightedItem);
						if (
							!$highlightedItem ||
							$highlightedItem?.dataset.hidden ||
							isHidden($highlightedItem)
						) {
							// Find next visible item
							const menuElement = document.getElementById(ids.menu);
							if (!isHTMLElement(menuElement)) return;
							const itemElements = getOptions(menuElement);
							const candidateNodes = itemElements.filter(
								(opt) => !isElementDisabled(opt) && !opt.dataset.hidden
							);

							highlightedItem.set(candidateNodes[0] ?? null);
						}
					});
				})
			);

			let unsubEscapeKeydown = noop;

			const escape = useEscapeKeydown(node, {
				handler: () => {
					closeMenu();
					reset();
				},
			});
			if (escape && escape.destroy) {
				unsubEscapeKeydown = escape.destroy;
			}

			return {
				destroy() {
					unsubscribe();
					unsubEscapeKeydown();
				},
			};
		},
	});

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
		action: (node: HTMLElement): MeltActionReturn<ComboboxEvents['menu']> => {
			let unsubPopper = noop;
			let unsubScroll = noop;
			const unsubscribe = executeCallbacks(
				//  Bind the popper portal to the input element.
				effect(
					[
						isVisible,
						preventScroll,
						closeOnEscape,
						portal,
						closeOnOutsideClick,
						positioning,
						activeTrigger,
					],
					([
						$isVisible,
						$preventScroll,
						$closeOnEscape,
						$portal,
						$closeOnOutsideClick,
						$positioning,
						$activeTrigger,
					]) => {
						unsubPopper();
						unsubScroll();

						if (!$isVisible || !$activeTrigger) return;
						if ($preventScroll) {
							unsubScroll = removeScroll();
						}

						const ignoreHandler = createClickOutsideIgnore(ids.input);

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
											ignore: ignoreHandler,
									  }
									: null,
								escapeKeydown: $closeOnEscape
									? {
											handler: () => {
												closeMenu();
												reset();
											},
									  }
									: null,
								portal: getPortalDestination(node, $portal),
							},
						});
						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
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

	const option = builder(name('option'), {
		stores: [selected],
		returned:
			([$selected]) =>
			(props: ComboboxItemProps<Value>) => {
				const selected = Array.isArray($selected)
					? $selected.map((o) => o.value).includes(props.value)
					: deepEqual($selected?.value, props.value);

				return {
					'data-value': JSON.stringify(props.value),
					'data-label': props.label,
					'data-disabled': disabledAttr(props.disabled),
					'aria-disabled': props.disabled ? true : undefined,
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					id: generateId(),
					role: 'option',
					style: styleToString({ cursor: props.disabled ? 'default' : 'pointer' }),
				} as const;
			},
		action: (node: HTMLElement): MeltActionReturn<ComboboxEvents['item']> => {
			const unsubscribe = executeCallbacks(
				// Handle highlighting items when the pointer moves over them.
				addMeltEventListener(node, 'pointermove', () => {
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

	/** ------------------- */
	/** LIFECYCLE & EFFECTS */
	/** ------------------- */

	onMount(() => {
		open.set(withDefaults.defaultOpen);

		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);
		if (!menuEl) return;

		const triggerEl = getElementByMeltId(ids.input);
		if (triggerEl) {
			activeTrigger.set(triggerEl);
		}

		const selectedEl = menuEl.querySelector('[data-selected]');
		if (!isHTMLElement(selectedEl)) return;

		const dataLabel = selectedEl.getAttribute('data-label');
		inputValue.set(dataLabel ?? selectedEl.textContent ?? '');
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
			option,
			menu,
			label,
		},
		states: {
			open,
			selected,
			highlighted,
			inputValue,
			touchedInput,
		},
		helpers: {
			isSelected,
			isHighlighted,
		},
		options,
	};
}
