import { usePopper } from '$lib/internal/actions';
import {
	FIRST_LAST_KEYS,
	SELECTION_KEYS,
	addEventListener,
	addHighlight,
	back,
	builder,
	createElHelpers,
	createTypeaheadSearch,
	effect,
	executeCallbacks,
	forward,
	generateId,
	getNextFocusable,
	getPortalParent,
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
	styleToString,
	toWritableStores,
	getFirstOption,
	getOptions,
	sleep,
	derivedVisible,
	addMeltEventListener,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { createLabel, createSeparator } from '$lib/builders';
import type { CreateSelectProps, SelectOptionProps } from './types';
import { usePortal } from '$lib/internal/actions';
import type { MeltActionReturn } from '$lib/internal/types';

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
	portal: 'body',
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

export function createSelect(props?: CreateSelectProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSelectProps;

	const options = toWritableStores(omit(withDefaults, 'value', 'defaultValueLabel'));

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
	} = options;

	let mounted = false;

	const openWritable = withDefaults.open ?? writable(true);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	// Open so we can register the optionsList items before mounted = true
	open.set(true);

	const valueWritable = withDefaults.value ?? writable<unknown>(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	const valueLabel = writable<string | number | null>(withDefaults.defaultValueLabel ?? null);
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
		label: generateId(),
	};

	onMount(() => {
		// Run after all initial effects
		tick().then(() => {
			mounted = true;
		});

		open.set(withDefaults.defaultOpen);

		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);

		if (!menuEl) return;

		const triggerEl = document.getElementById(ids.trigger);

		if (!triggerEl) return;
		activeTrigger.set(triggerEl);

		const selectedEl = menuEl.querySelector('[data-selected]');
		if (!isHTMLElement(selectedEl)) return;

		const dataLabel = selectedEl.getAttribute('data-label');
		valueLabel.set(dataLabel ?? selectedEl.textContent ?? null);
	});

	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

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
		action: (node: HTMLElement): MeltActionReturn<'keydown'> => {
			/**
			 * We need to get the parent portal before the menu is opened,
			 * otherwise the parent will have been moved to the body, and
			 * will no longer be an ancestor of this node.
			 */
			const portalParent = getPortalParent(node);
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
								portal: $portal ? (portalParent === $portal ? portalParent : $portal) : null,
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
					unsubEventListeners();
				},
			};
		},
	});

	type TriggerEvents = 'click' | 'keydown';

	const trigger = builder(name('trigger'), {
		stores: [open, disabled, required],
		returned: ([$open, $disabled, $required]) => {
			return {
				role: 'combobox',
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
		action: (node: HTMLElement): MeltActionReturn<TriggerEvents> => {
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
		action: (node): MeltActionReturn<'click'> => {
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

	type OptionProps = {
		value: unknown;
		label: string | null;
		disabled: boolean;
	};

	const getOptionProps = (el: HTMLElement) => {
		const value = el.getAttribute('data-value');
		const label = el.getAttribute('data-label');
		const disabled = el.hasAttribute('data-disabled');

		return {
			value,
			label: label ?? el.textContent ?? null,
			disabled: disabled ? true : false,
		};
	};

	const optionsList: OptionProps[] = [];

	type OptionEvents = 'click' | 'keydown' | 'pointermove' | 'pointerleave' | 'focusin' | 'focusout';

	const option = builder(name('option'), {
		stores: value,
		returned: ($value) => {
			return (props: SelectOptionProps) => {
				const optProps: OptionProps = {
					value: props.value,
					label: props.label ?? null,
					disabled: props.disabled ?? false,
				};
				optionsList.push(optProps);
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
		action: (node: HTMLElement): MeltActionReturn<OptionEvents> => {
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

					value.set(props.value);
					open.set(false);
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
						value.set(props.value);
						open.set(false);
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

	effect(value, ($value) => {
		if (!isBrowser) return;
		const newLabel = optionsList.find((opt) => opt.value === $value)?.label;

		valueLabel.set(newLabel ?? null);
	});

	const { typed, handleTypeaheadSearch } = createTypeaheadSearch();

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		const unsubs: Array<() => void> = [];

		if (!isBrowser) return;
		if ($open && get(preventScroll)) {
			unsubs.push(removeScroll());
		}

		const constantMounted = mounted;
		sleep(1).then(() => {
			const menuEl = document.getElementById(ids.menu);
			if (menuEl && $open && get(isUsingKeyboard)) {
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
			} else if ($activeTrigger && constantMounted) {
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
		const unsubs: Array<() => void> = [];
		const handlePointer = () => isUsingKeyboard.set(false);
		const handleKeyDown = () => {
			isUsingKeyboard.set(true);
			unsubs.push(
				executeCallbacks(
					addEventListener(document, 'pointerdown', handlePointer, { capture: true, once: true }),
					addEventListener(document, 'pointermove', handlePointer, { capture: true, once: true })
				)
			);
		};

		const keydownListener = (e: KeyboardEvent) => {
			if (e.key === kbd.ESCAPE) {
				open.set(false);
				const $activeTrigger = get(activeTrigger);
				if (!$activeTrigger) return;
				handleRovingFocus($activeTrigger);
			}
		};

		unsubs.push(
			executeCallbacks(
				addEventListener(document, 'keydown', handleKeyDown, { capture: true }),
				addEventListener(document, 'keydown', keydownListener)
			)
		);

		return () => {
			unsubs.forEach((unsub) => unsub());
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
			value,
			valueLabel,
		},
		helpers: {
			isSelected,
		},
		options,
	};
}
