import {
	executeCallbacks,
	generateId,
	addEventListener,
	kbd,
	styleToString,
	noop,
	effect,
	isBrowser,
	sleep,
	isHTMLElement,
} from '@melt-ui/svelte/internal/helpers';
import type { Action } from 'svelte/action';
import { writable, type Readable, derived, get, readonly } from 'svelte/store';
import type { HTMLAttributes, HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';
import { afterUpdate, tick } from 'svelte';
import { usePopper, type FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { Defaults } from '@melt-ui/svelte/internal/types';
import { getNextIndex, setAttribute } from '@melt-ui/svelte/builders/combobox/utils';

interface ComboboxProps<T> {
	items: T[];
	/** @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block */
	scrollAlignment?: 'nearest' | 'center';
	disabled?: boolean;
	value?: string;
	filterFunction: (item: T, value: string) => boolean;
	positioning?: FloatingConfig;
	itemToString: (item: T) => string;
}

interface Combobox<T> {
	open: Readable<boolean>;
	filterInput: Action<HTMLInputElement, void>;
	listItem: Action<HTMLLIElement, void>;
	// @TODO: support OL, DL, div, nav, etc
	list: Action<HTMLUListElement, void>;
	filterInputAttributes: Readable<HTMLInputAttributes>;
	labelAttributes: HTMLLabelAttributes;
	listAttributes: HTMLAttributes<HTMLUListElement | HTMLOListElement | HTMLDListElement>;
	selectedItem: Readable<T>;
	inputValue: Readable<string>;
}

const defaults = {
	disabled: false,
	scrollAlignment: 'nearest',
	value: '',
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
} satisfies Defaults<ComboboxProps<unknown>>;

// @TODO figure out how to on-the-fly update the list of items
// @TODO arrow key nav with a filtered subset of items
// @TODO figure out typing generics with `satisfies` and `Defaults`
// @TODO figure out how our utils <> their utils
// @TODO skipping over disabled list items
export function createCombobox<T>(args: ComboboxProps<T>) {
	const options = writable<ComboboxProps<T>>({ ...defaults, ...args });
	const open = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);
	/** @TODO Reconcile duplicate state between `value` and `selectedItem`. */
	/** @TODO default initial state. */
	const value = writable('');
	const selectedItem = writable<T>(undefined);

	const highlightedItem = writable<number>(0);
	const items = writable(args.items);
	/** A subset of `items` that match the `filterFunction` predicate. */
	const filteredItems = writable(args.items);

	const ids = {
		input: generateId(),
		menu: generateId(),
		label: generateId(),
	};

	function updateList(updaterFunction: (currentItems: T[]) => T[]) {
		const updatedItems = updaterFunction(get(items));
		items.set(updatedItems);
		filteredItems.set(updatedItems.filter((item) => get(options).filterFunction(item, get(value))));
	}

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

	const menu = {
		...derived([open], ([$open]) => {
			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				role: 'listbox',
			};
		}),
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

	effect([open, options, highlightedItem], ([$open, $options, $highlightedItem]) => {
		if (!isBrowser) return;

		const menuEl = document.getElementById(ids.menu);
		if (menuEl && $open) {
			// Focus on selected option or first option
			const selectedOption = menuEl.querySelector(`[data-index="${$highlightedItem}"]`) as
				| HTMLElement
				| undefined;

			if (selectedOption) {
				sleep(1).then(() => selectedOption.scrollIntoView({ block: $options.scrollAlignment }));
			}
		}
	});

	const option = {
		...derived([highlightedItem], ([$highlightedItem]) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (args: any) => {
				return {
					// @TODO set activedescendant on the input.
					// "aria-activedescendant"
					// 'aria-selected': $value === args?.value,
					// 'data-selected': $value === args?.value ? '' : undefined,
					'data-highlighted': $highlightedItem === args?.index,
					'data-disabled': args.disabled ? '' : undefined,
					'data-list-item': 'data-list-item',
					'data-index': args?.index,
					role: 'option',
					id: `${ids.input}-descendent-${args?.index}`,
				};
			};
		}),
		action: (node: HTMLLIElement) => {
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
						setSelectedItem(parsedIndex, document.getElementById(ids.input) as HTMLInputElement);
						document.getElementById(ids.input)?.focus();
					}

					open.set(false);
				})
			);

			return { destroy: unsub };
		},
	};

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
					id: ids.input,
					role: 'combobox',
					'data-disabled': $options.disabled ? true : undefined,
					disabled: $options.disabled,
				} as const)
		),
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'blur', () => {
					highlightedItem.set(0);
				}),
				addEventListener(node, 'focus', (e) => {
					// @TODO: abstract and use the input id instead? Thinking of this due to keyboard events also opening the box (although in testing, I haven't had any issues yet)
					const triggerEl = e.currentTarget as HTMLElement;
					activeTrigger.set(triggerEl);
					open.set(true);
				}),
				addEventListener(node, 'keydown', (e: KeyboardEvent) => {
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

					const $options = get(options);

					// Handle key events when the menu is open.
					switch (e.key) {
						case kbd.ESCAPE: {
							open.set(false);
							break;
						}
						case kbd.ENTER: {
							const $highlightedIndex = get(highlightedItem);
							setSelectedItem($highlightedIndex, e.target as HTMLInputElement);
							open.set(false);
							break;
						}
						case kbd.HOME: {
							highlightedItem.set(0);
							break;
						}
						case kbd.END: {
							const nextIndex = get(filteredItems).length - 1;
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
									itemCount: get(filteredItems).length,
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
									itemCount: get(filteredItems).length,
									moveAmount: -1,
								});
							});
							break;
						}
					}
				}),
				addEventListener(node, 'input', (e: Event) => {
					const $options = get(options);
					// @TODO: throttle this value
					const inputValue = (e.target as HTMLInputElement).value;
					value.set(inputValue);
					filteredItems.set(
						$options.items.filter((item) => $options.filterFunction(item, inputValue))
					);
				})
			);

			return { destroy: unsub };
		},
	};

	const isSelected = derived([selectedItem], ([$selectedItem]) => {
		return (item: T) => {
			return $selectedItem === item;
		};
	});

	// // Handles keyboard navigation between items.
	// onMount(() => {
	// 	const keydownListener = (e: KeyboardEvent) => {
	// 		const menuEl = document.getElementById(ids.menu);
	// 		if (!menuEl || menuEl.hidden) return;

	// 		if (e.key === kbd.ESCAPE) {
	// 			open.set(false);
	// 			activeTrigger.set(null);
	// 			return;
	// 		}

	// 		const allOptions = Array.from(menuEl.querySelectorAll('[role="option"]')) as HTMLElement[];
	// 		const focusedOption = allOptions.find((el) => el === document.activeElement);
	// 		const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

	// 		console.log({ focusedOption, focusedIndex });

	// 		if (e.key === kbd.ARROW_DOWN) {
	// 			e.preventDefault();
	// 			const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
	// 			const nextOption = allOptions[nextIndex] as HTMLElement;
	// 			nextOption.focus();
	// 			return;
	// 		} else if (e.key === kbd.ARROW_UP) {
	// 			e.preventDefault();
	// 			const prevIndex = focusedIndex - 1 < 0 ? allOptions.length - 1 : focusedIndex - 1;
	// 			const prevOption = allOptions[prevIndex] as HTMLElement;
	// 			prevOption.focus();
	// 			return;
	// 		} else if (e.key === kbd.HOME) {
	// 			e.preventDefault();
	// 			const firstOption = allOptions[0] as HTMLElement;
	// 			firstOption.focus();
	// 			return;
	// 		} else if (e.key === kbd.END) {
	// 			e.preventDefault();
	// 			const lastOption = allOptions[allOptions.length - 1] as HTMLElement;
	// 			lastOption.focus();
	// 			return;
	// 		}
	// 	};

	// 	const unsub = addEventListener(document, 'keydown', keydownListener);
	// 	return unsub();
	// });

	return {
		filteredItems: readonly(filteredItems),
		input,
		isSelected,
		menu,
		open,
		option,
		options,
		updateList,
		value,
	};
}
