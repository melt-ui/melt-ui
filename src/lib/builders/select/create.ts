import { createLabel, createSeparator } from '$lib/builders/index.js';
import { usePopper, usePortal } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	SELECTION_KEYS,
	addEventListener,
	addHighlight,
	addMeltEventListener,
	back,
	builder,
	createElHelpers,
	createTypeaheadSearch,
	derivedVisible,
	effect,
	executeCallbacks,
	forward,
	generateId,
	getFirstOption,
	getNextFocusable,
	getOptions,
	getPortalDestination,
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
	overridable,
	prev,
	removeHighlight,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
	toggle,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { SelectEvents } from './events.js';
import type { CreateSelectProps, SelectOption, SelectOptionProps } from './types.js';

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
	defaultOpen: false,
	forceVisible: false,
	portal: undefined,
	closeOnEscape: true,
	closeOnOutsideClick: true,
} satisfies CreateSelectProps;

type SelectParts =
	| 'menu'
	| 'trigger'
	| 'option'
	| 'group'
	| 'group-label'
	| 'arrow'
	| 'input'
	| 'label';

const { name } = createElHelpers<SelectParts>('select');

export function createSelect<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Selected extends Multiple extends true
		? Array<SelectOption<Value>>
		: SelectOption<Value> = Multiple extends true ? Array<SelectOption<Value>> : SelectOption<Value>
>(props?: CreateSelectProps<Value, Multiple, Selected>) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSelectProps<
		Value,
		Multiple,
		Selected
	>;

	const options = toWritableStores({
		...omit(
			withDefaults,
			'selected',
			'defaultSelected',
			'onSelectedChange',
			'onOpenChange',
			'open',
			'defaultOpen'
		),
		multiple: withDefaults.multiple ?? (false as Multiple),
	});

	const {
		positioning,
		arrowSize,
		required,
		disabled,
		loop,
		preventScroll,
		name: nameStore,
		portal,
		forceVisible,
		closeOnEscape,
		closeOnOutsideClick,
		multiple,
	} = options;

	const openWritable = withDefaults.open ?? writable(false);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const selectedWritable =
		withDefaults.selected ?? writable<Selected | undefined>(withDefaults.defaultSelected);
	const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);

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
	let isUsingKeyboard = false;

	const ids = {
		menu: generateId(),
		trigger: generateId(),
		label: generateId(),
	};

	const { typed, handleTypeaheadSearch } = createTypeaheadSearch();

	/* ------- */
	/* Helpers */
	/* ------- */
	const isSelected = derived([selected], ([$selected]) => {
		return (value: Value) => {
			if (Array.isArray($selected)) {
				return $selected.map((o) => o.value).includes(value);
			}
			return ($selected as SelectOption<Value>) === value;
		};
	});

	function isMouse(e: PointerEvent) {
		return e.pointerType === 'mouse';
	}

	function getSelectedOption(menuElement: HTMLElement) {
		const selectedOption = menuElement.querySelector('[data-selected]');
		return isHTMLElement(selectedOption) ? selectedOption : null;
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

		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentFocusedItem) || !isHTMLElement(currentTarget)) return;

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

	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	const selectedLabel = derived(selected, ($selected) => {
		if (Array.isArray($selected)) {
			return $selected.map((o) => o.label).join(', ');
		}
		return $selected?.label ?? '';
	});

	/* -------- */
	/* Builders */
	/* -------- */
	const menu = builder(name('menu'), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			return {
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
				role: 'listbox',
				'data-portal': $portal ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<SelectEvents['menu']> => {
			let unsubPopper = noop;
			let unsubScroll = noop;

			const unsubDerived = effect(
				[isVisible, preventScroll, positioning, portal, closeOnEscape, closeOnOutsideClick],
				([
					$isVisible,
					$preventScroll,
					$positioning,
					$portal,
					$closeOnEscape,
					$closeOnOutsideClick,
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
								clickOutside: $closeOnOutsideClick ? undefined : null,
								escapeKeydown: $closeOnEscape
									? {
											handler: () => {
												open.set(false);
											},
									  }
									: null,
								portal: getPortalDestination(node, $portal),
							},
						});

						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
					});
				}
			);

			const unsubEventListeners = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					const menuEl = e.currentTarget;
					const target = e.target;

					if (!isHTMLElement(menuEl) || !isHTMLElement(target)) return;

					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					const isCharacterKey = e.key.length === 1;

					if (e.key === kbd.TAB) {
						e.preventDefault();
						open.set(false);
						handleTabNavigation(e);
					}

					if (FIRST_LAST_KEYS.includes(e.key)) {
						e.preventDefault();
						if (menuEl === target) {
							const selectedOption = getSelectedOption(menuEl);
							if (selectedOption) {
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

			const unsubPortal = usePortal(node, 'body')?.destroy;

			return {
				destroy() {
					unsubDerived();
					unsubPopper();
					unsubPortal?.();
					unsubScroll();
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
				type: 'button',
				'aria-autocomplete': 'none',
				'aria-haspopup': 'listbox',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-required': $required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $disabled ? true : undefined,
				'aria-labelledby': ids.label,
				disabled: $disabled,
				id: ids.trigger,
				tabindex: 0,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<SelectEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					if (get(disabled)) {
						e.preventDefault();
						return;
					}

					const $open = get(open);
					const triggerEl = e.currentTarget;
					if (!isHTMLElement(triggerEl)) return;

					open.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							nextFocusable.set(getNextFocusable(triggerEl));
							prevFocusable.set(getPreviousFocusable(triggerEl));
							activeTrigger.set(triggerEl);
						}
						return isOpen;
					});
					if (!$open) e.preventDefault();
				}),

				addMeltEventListener(node, 'keydown', (e) => {
					const triggerEl = e.currentTarget;
					if (!isHTMLElement(triggerEl)) return;

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
								nextFocusable.set(getNextFocusable(triggerEl));
								prevFocusable.set(getPreviousFocusable(triggerEl));
								activeTrigger.set(triggerEl);
							}

							return isOpen;
						});

						const menu = document.getElementById(ids.menu);
						if (!menu) return;

						const selectedOption = menu.querySelector('[data-selected]');
						if (isHTMLElement(selectedOption)) {
							handleRovingFocus(selectedOption);
							return;
						}

						const options = getOptions(menu);
						if (!options.length) return;

						handleRovingFocus(options[0]);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	// Use our existing label builder to create a label for the select trigger.
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
		action: (node): MeltActionReturn<SelectEvents['label']> => {
			const destroy = executeCallbacks(
				labelAction(node).destroy ?? noop,
				addMeltEventListener(node, 'click', (e) => {
					e.preventDefault();
					const triggerEl = document.getElementById(ids.trigger);
					if (!isHTMLElement(triggerEl)) return;

					triggerEl.focus();
				})
			);

			return {
				destroy,
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

	const getOptionProps = (el: HTMLElement): SelectOptionProps<Value> => {
		const value = el.getAttribute('data-value');
		const label = el.getAttribute('data-label');
		const disabled = el.hasAttribute('data-disabled');

		return {
			value: value ? JSON.parse(value) : value,
			label: label ?? el.textContent ?? undefined,
			disabled: disabled ? true : false,
		};
	};

	const setOption = (newOption: SelectOption<Value>) => {
		selected.update(($option) => {
			const $multiple = get(multiple);
			if ($multiple) {
				const optionArr = Array.isArray($option) ? $option : [];
				return toggle(newOption, optionArr) as Selected;
			}
			return newOption as Selected;
		});
	};

	const option = builder(name('option'), {
		stores: selected,
		returned: ($selected) => {
			return (props: SelectOptionProps<Value>) => {
				const isSelected = Array.isArray($selected)
					? $selected.map((o) => o.value).includes(props.value)
					: $selected?.value === props?.value;

				return {
					role: 'option',
					'aria-selected': isSelected,
					'data-selected': isSelected ? '' : undefined,
					'data-value': JSON.stringify(props.value),
					'data-label': props.label ?? undefined,
					'data-disabled': props.disabled ? '' : undefined,
					tabindex: -1,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<SelectEvents['option']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					const props = getOptionProps(node);
					if (props.disabled) {
						e.preventDefault();
						return;
					}
					handleRovingFocus(itemElement);

					setOption(props);
					const $multiple = get(multiple);
					if (!$multiple) open.set(false);
				}),

				addMeltEventListener(node, 'keydown', (e) => {
					const $typed = get(typed);
					const isTypingAhead = $typed.length > 0;
					if (isTypingAhead && e.key === kbd.SPACE) {
						e.preventDefault();
						return;
					}
					if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						const props = getOptionProps(node);
						node.setAttribute('data-selected', '');

						setOption(props);
						const $multiple = get(multiple);
						if (!$multiple) open.set(false);
					}
				}),
				addMeltEventListener(node, 'pointermove', (e) => {
					const props = getOptionProps(node);
					if (props.disabled) {
						e.preventDefault();
						return;
					}

					const itemEl = e.currentTarget;
					if (!isHTMLElement(itemEl)) return;

					if (props.disabled) {
						const menuElement = document.getElementById(ids.menu);
						if (!menuElement) return;
						handleRovingFocus(menuElement);
					}

					onOptionPointerMove(e);
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (!isMouse(e)) return;
					onOptionLeave();
				}),
				addMeltEventListener(node, 'focusin', (e) => {
					const itemEl = e.currentTarget;
					if (!isHTMLElement(itemEl)) return;
					addHighlight(itemEl);
				}),
				addMeltEventListener(node, 'focusout', (e) => {
					const itemEl = e.currentTarget;
					if (!isHTMLElement(itemEl)) return;
					removeHighlight(itemEl);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder(name('input'), {
		stores: [selected, required, disabled, nameStore],
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

	/* ------------------- */
	/* Lifecycle & Effects */
	/* ------------------- */
	onMount(() => {
		const triggerEl = document.getElementById(ids.trigger);
		if (triggerEl) {
			activeTrigger.set(triggerEl);
		}
	});

	let hasOpened = false;
	effect(open, ($open) => {
		if ($open) {
			hasOpened = true;
		}
	});

	effect([open, activeTrigger], function handleFocus([$open, $activeTrigger]) {
		const unsubs: Array<() => void> = [];

		if (!isBrowser) return;
		if ($open && get(preventScroll)) {
			unsubs.push(removeScroll());
		}

		sleep(1).then(() => {
			const menuEl = document.getElementById(ids.menu);
			if (menuEl && $open && isUsingKeyboard) {
				// Focus on selected option or first option
				const selectedOption = getSelectedOption(menuEl);

				if (!selectedOption) {
					const firstOption = getFirstOption(menuEl);
					if (!firstOption) return;
					handleRovingFocus(firstOption);
				} else {
					handleRovingFocus(selectedOption);
				}
			} else if (menuEl && $open) {
				// focus on the menu element
				handleRovingFocus(menuEl);
			} else if ($activeTrigger && hasOpened) {
				// Hacky way to prevent the keydown event from triggering on the trigger
				handleRovingFocus($activeTrigger);
			}
		});

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		const handlePointer = () => (isUsingKeyboard = false);
		const handleKeyDown = (e: KeyboardEvent) => {
			isUsingKeyboard = true;
			if (e.key === kbd.ESCAPE && $open) {
				open.set(false);
				if (!$activeTrigger) return;
				handleRovingFocus($activeTrigger);
			}
		};

		return executeCallbacks(
			addEventListener(document, 'keydown', handleKeyDown, { capture: true }),
			addEventListener(document, 'pointerdown', handlePointer, { capture: true, once: true }),
			addEventListener(document, 'pointermove', handlePointer, { capture: true, once: true })
		);
	});

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
			label,
		},
		states: {
			open,
			selected,
			selectedLabel,
		},
		helpers: {
			isSelected,
		},
		options,
	};
}
