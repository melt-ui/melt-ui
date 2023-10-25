import { useEscapeKeydown, usePopper } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	addHighlight,
	addMeltEventListener,
	back,
	builder,
	createClickOutsideIgnore,
	createElHelpers,
	createTypeaheadSearch,
	derivedVisible,
	disabledAttr,
	effect,
	executeCallbacks,
	forward,
	generateId,
	getElementByMeltId,
	getOptions,
	getPortalDestination,
	hiddenInputAttrs,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	isHTMLInputElement,
	kbd,
	last,
	next,
	noop,
	omit,
	overridable,
	prev,
	removeHighlight,
	removeScroll,
	styleToString,
	toWritableStores,
	toggle,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { dequal as deepEqual } from 'dequal';
import { onMount, tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import { createLabel } from '../label/create.js';
import type { ListboxEvents } from './events.js';
import type {
	CreateListboxProps,
	ListboxOption,
	ListboxOptionProps,
	ListboxSelected,
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
	builder: 'listbox',
	disabled: false,
	required: false,
	name: undefined,
	typeahead: true,
} satisfies Defaults<CreateListboxProps<unknown>>;

/**
 * Creates an ARIA-1.2-compliant listbox.
 *
 * @TODO multi-select using `tags-input` builder?
 */
export function createListbox<
	Value,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
>(props?: CreateListboxProps<Value, Multiple, S>) {
	const withDefaults = { ...defaults, ...props } satisfies CreateListboxProps<Value, Multiple, S>;

	// Trigger element for the popper portal. This will be our input element.
	const activeTrigger = writable<HTMLElement | null>(null);
	// The currently highlighted menu item.
	const highlightedItem = writable<HTMLElement | null>(null);

	const selectedWritable =
		withDefaults.selected ?? writable<S | undefined>(withDefaults.defaultSelected);

	const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);

	const highlighted = derived(highlightedItem, ($highlightedItem) =>
		$highlightedItem ? getOptionProps($highlightedItem) : undefined
	) as Readable<ListboxOption<Value> | undefined>;

	// Either the provided open store or a store with the default open value
	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	// The overridable open store which is the source of truth for the open state.
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const options = toWritableStores({
		...omit(withDefaults, 'open', 'defaultOpen', 'builder'),
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
		arrowSize,
		disabled,
		required,
		typeahead,
		name: nameProp,
	} = options;
	const { name, selector } = createElHelpers(withDefaults.builder);

	const ids = {
		trigger: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	const { handleTypeaheadSearch } = createTypeaheadSearch({
		onMatch: (element) => {
			highlightedItem.set(element);
			element.scrollIntoView({ block: get(scrollAlignment) });
		},
		getCurrentItem() {
			return get(highlightedItem);
		},
	});

	/** ------- */
	/** HELPERS */
	/** ------- */
	function getOptionProps(el: HTMLElement): ListboxOptionProps<Value> {
		const value = el.getAttribute('data-value');
		const label = el.getAttribute('data-label');
		const disabled = el.hasAttribute('data-disabled');

		return {
			value: value ? JSON.parse(value) : value,
			label: label ?? el.textContent ?? undefined,
			disabled: disabled ? true : false,
		};
	}

	const setOption = (newOption: ListboxOption<Value>) => {
		selected.update(($option) => {
			const $multiple = get(multiple);
			if ($multiple) {
				const optionArr = Array.isArray($option) ? $option : [];
				return toggle(newOption, optionArr, (itemA, itemB) =>
					deepEqual(itemA.value, itemB.value)
				) as S;
			}
			return newOption as S;
		});
	};

	/**
	 * Selects an item from the menu
	 * @param index array index of the item to select.
	 */
	function selectItem(item: HTMLElement) {
		const props = getOptionProps(item);

		setOption(props);
	}

	/**
	 * Opens the menu, sets the active trigger, and highlights
	 * the selected item (if one exists). It also optionally accepts the current
	 * open state to prevent unnecessary updates if we know the menu is already open.
	 */
	async function openMenu() {
		open.set(true);

		const triggerEl = getElementByMeltId(ids.trigger);
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
		highlightedItem.set(null);
	}

	/**
	 * To properly anchor the popper to the input/trigger, we need to ensure both
	 * the open state is true and the activeTrigger is not null. This helper store's
	 * value is true when both of these conditions are met and keeps the code tidy.
	 */
	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	/* ------ */
	/* STATES */
	/* ------ */

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

	/* -------- */
	/* ELEMENTS */
	/* -------- */

	/** Action and attributes for the text input. */
	const trigger = builder(name('trigger'), {
		stores: [open, highlightedItem, disabled],
		returned: ([$open, $highlightedItem, $disabled]) => {
			return {
				'aria-activedescendant': $highlightedItem?.id,
				'aria-autocomplete': 'list',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-labelledby': ids.label,
				'data-melt-id': ids.trigger,
				// autocomplete: 'off',
				id: ids.trigger,
				role: 'combobox',
				disabled: disabledAttr($disabled),
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<ListboxEvents['trigger']> => {
			const isInput = isHTMLInputElement(node);

			const unsubscribe = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const $open = get(open);
					if ($open) {
						closeMenu();
					} else {
						openMenu();
					}
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
						if (e.key === kbd.BACKSPACE && isInput && node.value === '') {
							return;
						}

						// Clicking space on a button triggers a click event. We don't want to
						// open the menu in this case, and we let the click handler handle it.
						if (e.key === kbd.SPACE && node instanceof HTMLButtonElement) {
							return;
						}

						// All other events should open the menu.
						openMenu();

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
								enabledItems[0].scrollIntoView({ block: get(scrollAlignment) });
							} else if (e.key === kbd.ARROW_UP) {
								highlightedItem.set(last(enabledItems));
								last(enabledItems).scrollIntoView({ block: get(scrollAlignment) });
							}
						});
					}
					/**
					 * When the menu is open...
					 */
					// Pressing `esc` should close the menu.
					if (e.key === kbd.TAB || e.key === kbd.ESCAPE) {
						closeMenu();
						return;
					}
					// Pressing enter with a highlighted item should select it.
					if (e.key === kbd.ENTER) {
						e.preventDefault();
						const $highlightedItem = get(highlightedItem);
						if ($highlightedItem) {
							selectItem($highlightedItem);
						}
						if (!get(multiple)) {
							closeMenu();
						}
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
						nextItem?.scrollIntoView({ block: $scrollAlignment });
					} else if (get(typeahead)) {
						const menuEl = document.getElementById(ids.menu);
						if (!isHTMLElement(menuEl)) return;

						handleTypeaheadSearch(e.key, getOptions(menuEl));
					}
				})
			);

			let unsubEscapeKeydown = noop;

			const escape = useEscapeKeydown(node, {
				handler: () => {
					closeMenu();
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
		action: (node: HTMLElement): MeltActionReturn<ListboxEvents['menu']> => {
			let unsubPopper = noop;
			let unsubScroll = noop;
			const unsubscribe = executeCallbacks(
				// Bind the popper portal to the input element.
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

						const ignoreHandler = createClickOutsideIgnore(ids.trigger);

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
											},
											ignore: ignoreHandler,
									  }
									: null,
								escapeKeydown: $closeOnEscape
									? {
											handler: () => {
												closeMenu();
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
				)
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

	// Use our existing label builder to create a label for the listbox input.
	const {
		elements: { root: labelBuilder },
	} = createLabel();
	const { action: labelAction } = get(labelBuilder);

	const label = builder(name('label'), {
		returned: () => {
			return {
				id: ids.label,
				for: ids.trigger,
			};
		},
		action: labelAction,
	});

	const option = builder(name('option'), {
		stores: [selected],
		returned:
			([$selected]) =>
			(props: ListboxOptionProps<Value>) => {
				const selected = Array.isArray($selected)
					? $selected.some((o) => deepEqual(o.value, props.value))
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
				} as const;
			},
		action: (node: HTMLElement): MeltActionReturn<ListboxEvents['item']> => {
			const unsubscribe = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					// If the item is disabled, `preventDefault` to stop the input losing focus.
					if (isElementDisabled(node)) {
						e.preventDefault();
						return;
					}
					// Otherwise, select the item and close the menu.
					selectItem(node);
					if (!get(multiple)) {
						closeMenu();
					}
				}),
				addMeltEventListener(node, 'mouseover', () => {
					highlightedItem.set(node);
				})
			);
			return { destroy: unsubscribe };
		},
	});

	const hiddenInput = builder(name('hidden-input'), {
		stores: [selected, required, nameProp],
		returned: ([$selected, $required, $name]) => {
			const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
			return {
				...hiddenInputAttrs,
				required: $required ? true : undefined,
				value,
				name: $name,
			};
		},
	});

	const arrow = builder(name('arrow'), {
		stores: arrowSize,
		returned: ($arrowSize) => ({
			'data-arrow': true,
			style: styleToString({
				position: 'absolute',
				width: `var(--arrow-size, ${$arrowSize}px)`,
				height: `var(--arrow-size, ${$arrowSize}px)`,
			}),
		}),
	});

	/* ------------------- */
	/* LIFECYCLE & EFFECTS */
	/* ------------------- */

	onMount(() => {
		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);
		if (!menuEl) return;

		const triggerEl = getElementByMeltId(ids.trigger);
		if (triggerEl) {
			activeTrigger.set(triggerEl);
		}

		const selectedEl = menuEl.querySelector('[data-selected]');
		if (!isHTMLElement(selectedEl)) return;
	});

	/**
	 * Handles moving the `data-highlighted` attribute between items when
	 * the user moves their pointer or navigates with their keyboard.
	 */
	effect([highlightedItem], ([$highlightedItem]) => {
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
	});

	return {
		ids,
		elements: {
			trigger,
			option,
			menu,
			label,
			hiddenInput,
			arrow,
		},
		states: {
			open,
			selected,
			highlighted,
		},
		helpers: {
			isSelected,
			isHighlighted,
			closeMenu,
		},
		options,
	};
}
