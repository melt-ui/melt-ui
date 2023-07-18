import { usePopper } from '$lib/internal/actions/popper';
import {
	FIRST_LAST_KEYS,
	SELECTION_KEYS,
	addEventListener,
	back,
	builder,
	createElHelpers,
	createTypeaheadSearch,
	effect,
	executeCallbacks,
	forward,
	generateId,
	getNextFocusable,
	getPreviousFocusable,
	handleRovingFocus,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	kbd,
	last,
	next,
	noop,
	omit,
	prev,
	removeScroll,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';
import { getFirstOption, getOptions } from '$lib/internal/helpers/list';
import { sleep } from '$lib/internal/helpers/sleep';
import type { Defaults } from '$lib/internal/types';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { createSeparator } from '../separator';
import type { CreateSelectProps, SelectOptionProps } from './types';

const defaults = {
	arrowSize: 8,
	required: false,
	disabled: false,
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
	preventScroll: true,
	loop: false,
	name: undefined,
} satisfies Defaults<CreateSelectProps>;

type SelectParts = 'menu' | 'trigger' | 'option' | 'group' | 'group-label' | 'arrow' | 'input';
const { name } = createElHelpers<SelectParts>('select');

export function createSelect(props?: CreateSelectProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSelectProps;

	const options = toWritableStores(omit(withDefaults, 'value', 'label'));
	const {
		positioning,
		arrowSize,
		required,
		disabled,
		loop,
		preventScroll,
		name: nameStore,
	} = options;

	const open = writable(false);
	const value = writable<unknown>(withDefaults.value ?? null);
	const label = writable<string | number | null>(withDefaults.label ?? null);
	const activeTrigger = writable<HTMLElement | null>(null);

	/**
	 * Keeps track of the next/previous focusable element when the menu closes.
	 * This is because we are portaling the menu to the body and we need
	 * to be able to focus the next element in the DOM when the menu closes.
	 *
	 * Without keeping track of this, the focus would be reset to the top of
	 * the page (or the first focusable element in the body).
	 */
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	/**
	 * Keeps track of if the user is using the keyboard to navigate the menu.
	 * This is used to determine how we handle focus on open behavior differently
	 * than when the user is using the mouse.
	 */
	const isUsingKeyboard = writable(false);

	const ids = {
		menu: generateId(),
		trigger: generateId(),
	};

	onMount(() => {
		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);
		if (!menuEl) return;

		const selectedEl = menuEl.querySelector('[data-selected]');
		if (!isHTMLElement(selectedEl)) return;

		const dataLabel = selectedEl.getAttribute('data-label');
		label.set(dataLabel ?? selectedEl.textContent ?? null);
	});

	const menu = builder(name('menu'), {
		stores: open,
		returned: ($open) => {
			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
				role: 'listbox',
			};
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[open, activeTrigger, positioning],
				([$open, $activeTrigger, $positioning]) => {
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: $positioning,
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				}
			);

			const unsubEventListeners = executeCallbacks(
				addEventListener(node, 'keydown', (e) => {
					const menuElement = e.currentTarget;
					if (!isHTMLElement(menuElement)) return;

					const target = e.target;
					if (!isHTMLElement(target)) return;

					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					const isCharacterKey = e.key.length === 1;

					if (e.key === kbd.TAB) {
						e.preventDefault();
						activeTrigger.set(null);
						open.set(false);
						handleTabNavigation(e);
					}

					if (FIRST_LAST_KEYS.includes(e.key)) {
						e.preventDefault();
						if (menuElement === target) {
							const selectedOption = getSelectedOption(menuElement);
							if (isHTMLElement(selectedOption)) {
								handleRovingFocus(selectedOption);
								return;
							}
						}
						handleMenuNavigation(e);
					}

					if (!isModifierKey && isCharacterKey) {
						handleTypeaheadSearch(e.key, getOptions(node));
					}
				})
			);

			return {
				destroy() {
					unsubDerived();
					unsubPopper();
					unsubEventListeners();
				},
			};
		},
	});

	const trigger = builder(name('trigger'), {
		stores: [open, disabled, required],
		returned: ([$open, $disabled, $required]) => {
			return {
				role: 'combobox',
				'aria-autocomplete': 'none',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-required': $required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $disabled ? true : undefined,
				disabled: $disabled,
				id: ids.trigger,
				tabindex: 0,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					if (get(disabled)) {
						e.preventDefault();
						return;
					}

					const $open = get(open);
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					open.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							nextFocusable.set(getNextFocusable(triggerElement));
							prevFocusable.set(getPreviousFocusable(triggerElement));
							activeTrigger.set(triggerElement);
						} else {
							activeTrigger.set(null);
						}

						return isOpen;
					});
					if (!$open) e.preventDefault();
				}),

				addEventListener(node, 'keydown', (e) => {
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					if (
						SELECTION_KEYS.includes(e.key) ||
						e.key === kbd.ARROW_DOWN ||
						e.key === kbd.ARROW_UP
					) {
						if (e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
							/**
							 * We don't want to scroll the page when the user presses the
							 * down arrow when focused on the trigger, so we prevent that
							 * default behavior.
							 */
							e.preventDefault();
						}
						open.update((prev) => {
							const isOpen = !prev;
							if (isOpen) {
								e.preventDefault();
								nextFocusable.set(getNextFocusable(triggerElement));
								prevFocusable.set(getPreviousFocusable(triggerElement));
								activeTrigger.set(triggerElement);
							} else {
								activeTrigger.set(null);
							}

							return isOpen;
						});

						const menu = document.getElementById(ids.menu);
						if (!isHTMLElement(menu)) return;

						const selectedOption = menu.querySelector('[data-selected]');
						if (isHTMLElement(selectedOption)) {
							handleRovingFocus(selectedOption);
							return;
						}

						const options = getOptions(menu);
						if (!options.length) return;

						const nextFocusedElement = options[0];
						if (!isHTMLElement(nextFocusedElement)) return;

						handleRovingFocus(nextFocusedElement);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const {
		elements: { root: separator },
	} = createSeparator({
		decorative: true,
	});

	const group = builder(name('group'), {
		returned: () => {
			return (groupId: string) => ({
				role: 'group',
				'aria-labelledby': groupId,
			});
		},
	});

	const groupLabel = builder(name('group-label'), {
		returned: () => {
			return (groupId: string) => ({
				id: groupId,
			});
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

	const option = builder(name('option'), {
		stores: value,
		returned: ($value) => {
			return (props: SelectOptionProps) => {
				return {
					role: 'option',
					'aria-selected': $value === props?.value,
					'data-selected': $value === props?.value ? '' : undefined,
					'data-value': props.value,
					'data-label': props.label ?? undefined,
					'data-disabled': props.disabled ? '' : undefined,
					tabindex: -1,
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			const getElprops = () => {
				const value = node.getAttribute('data-value');
				const label = node.getAttribute('data-label');
				const disabled = node.hasAttribute('data-disabled');

				return {
					value,
					label: label ?? node.textContent ?? null,
					disabled: disabled ? true : false,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'pointerdown', (e) => {
					const props = getElprops();
					if (props.disabled) {
						e.preventDefault();
						return;
					}
				}),

				addEventListener(node, 'click', (e) => {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					const props = getElprops();
					if (props.disabled) {
						e.preventDefault();
						return;
					}
					handleRovingFocus(itemElement);

					value.set(props.value);
					label.set(props.label);
					open.set(false);
				}),

				addEventListener(node, 'keydown', (e) => {
					const $typed = get(typed);
					const isTypingAhead = $typed.length > 0;
					if (isTypingAhead && e.key === kbd.SPACE) {
						e.preventDefault();
						return;
					}
					if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						const props = getElprops();
						node.setAttribute('data-selected', '');
						value.set(props.value);
						label.set(props.label);
						open.set(false);
					}
				}),
				addEventListener(node, 'pointermove', (e) => {
					const props = getElprops();
					if (props.disabled) {
						e.preventDefault();
						return;
					}

					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					if (props.disabled) {
						const menuElement = document.getElementById(ids.menu);
						if (!isHTMLElement(menuElement)) return;
						handleRovingFocus(menuElement);
					}

					onOptionPointerMove(e);
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (!isMouse(e)) return;
					onOptionLeave();
				}),
				addEventListener(node, 'focusin', (e) => {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;
					itemElement.setAttribute('data-highlighted', '');
				}),
				addEventListener(node, 'focusout', (e) => {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;
					itemElement.removeAttribute('data-highlighted');
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const { typed, handleTypeaheadSearch } = createTypeaheadSearch();

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		const unsubs: Array<() => void> = [];

		if (!isBrowser) return;
		if ($open && get(preventScroll)) {
			unsubs.push(removeScroll());
		}

		sleep(1).then(() => {
			const menuEl = document.getElementById(ids.menu);
			if (menuEl && $open && get(isUsingKeyboard)) {
				// Focus on selected option or first option
				const selectedOption = getSelectedOption(menuEl);

				if (!isHTMLElement(selectedOption)) {
					const firstOption = getFirstOption(menuEl);
					if (!isHTMLElement(firstOption)) return;
					handleRovingFocus(firstOption);
				} else {
					handleRovingFocus(selectedOption);
				}
			} else if (menuEl && $open) {
				// focus on the menu element
				handleRovingFocus(menuEl);
			} else if ($activeTrigger) {
				// Hacky way to prevent the keydown event from triggering on the trigger
				handleRovingFocus($activeTrigger);
			}
		});

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	const isSelected = derived([value], ([$value]) => {
		return (value: unknown) => {
			return $value === value;
		};
	});

	onMount(() => {
		const handlePointer = () => isUsingKeyboard.set(false);
		const handleKeyDown = () => {
			isUsingKeyboard.set(true);
			document.addEventListener('pointerdown', handlePointer, { capture: true, once: true });
			document.addEventListener('pointermove', handlePointer, { capture: true, once: true });
		};
		document.addEventListener('keydown', handleKeyDown, { capture: true });

		const keydownListener = (e: KeyboardEvent) => {
			if (e.key === kbd.ESCAPE) {
				open.set(false);
				const $activeTrigger = get(activeTrigger);
				if (!$activeTrigger) return;
				handleRovingFocus($activeTrigger);
			}
		};
		document.addEventListener('keydown', keydownListener);

		return () => {
			document.removeEventListener('keydown', handleKeyDown, { capture: true });
			document.removeEventListener('pointerdown', handlePointer, { capture: true });
			document.removeEventListener('pointermove', handlePointer, { capture: true });
			document.removeEventListener('keydown', keydownListener);
		};
	});

	const input = builder(name('input'), {
		stores: [value, required, disabled, nameStore],
		returned: ([$value, $required, $disabled, $nameStore]) => {
			return {
				type: 'hidden',
				name: $nameStore,
				value: $value,
				'aria-hidden': true,
				hidden: true,
				tabIndex: -1,
				required: $required,
				disabled: $disabled,
				style: styleToString({
					position: 'absolute',
					opacity: 0,
					'pointer-events': 'none',
					margin: 0,
					transform: 'translateX(-100%)',
				}),
			};
		},
	});

	function isMouse(e: PointerEvent) {
		return e.pointerType === 'mouse';
	}

	function getSelectedOption(menuElement: HTMLElement) {
		return menuElement.querySelector('[data-selected]');
	}

	function onOptionPointerMove(e: PointerEvent) {
		if (!isMouse(e)) return;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;
		handleRovingFocus(currentTarget);
	}

	function onOptionLeave() {
		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) return;
		handleRovingFocus(menuElement);
	}

	/**
	 * Keyboard event handler for menu navigation
	 * @param e The keyboard event
	 */
	function handleMenuNavigation(e: KeyboardEvent) {
		e.preventDefault();

		// currently focused menu item
		const currentFocusedItem = document.activeElement;
		if (!isHTMLElement(currentFocusedItem)) return;

		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		// menu items of the current menu
		const items = getOptions(currentTarget);
		if (!items.length) return;
		// Disabled items can't be highlighted. Skip them.
		const candidateNodes = items.filter((opt) => !isElementDisabled(opt));
		// Get the index of the currently highlighted item.
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);
		// Find the next menu item to highlight.
		let nextItem: HTMLElement;
		const $loop = get(loop);
		switch (e.key) {
			case kbd.ARROW_DOWN:
				nextItem = next(candidateNodes, currentIndex, $loop);
				break;
			case kbd.PAGE_DOWN:
				nextItem = forward(candidateNodes, currentIndex, 10, $loop);
				break;
			case kbd.ARROW_UP:
				nextItem = prev(candidateNodes, currentIndex, $loop);
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
		handleRovingFocus(nextItem);
	}

	function handleTabNavigation(e: KeyboardEvent) {
		if (e.shiftKey) {
			const $prevFocusable = get(prevFocusable);
			if ($prevFocusable) {
				e.preventDefault();
				$prevFocusable.focus();
				prevFocusable.set(null);
			}
		} else {
			const $nextFocusable = get(nextFocusable);
			if ($nextFocusable) {
				e.preventDefault();
				$nextFocusable.focus();
				nextFocusable.set(null);
			}
		}
	}

	return {
		elements: {
			menu,
			trigger,
			option,
			input,
			group,
			groupLabel,
			arrow,
			separator,
		},
		states: {
			open,
			value,
			label,
		},
		helpers: {
			isSelected,
		},
		options,
	};
}
