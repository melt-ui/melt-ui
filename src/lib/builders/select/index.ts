import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	addEventListener,
	createTypeaheadSearch,
	effect,
	executeCallbacks,
	generateId,
	handleRovingFocus,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	omit,
	removeScroll,
	styleToString,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import type { Defaults } from '$lib/internal/types';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { createSeparator } from '../separator';

const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
/**
 * Features:
 * - [X] Click outside
 * - [X] Keyboard navigation
 * - [X] Focus management
 * - [ ] Detect overflow
 * - [ ] Same width as trigger
 * - [ ] A11y
 * - [X] Floating UI
 **/

export type CreateSelectArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	value?: unknown;
	label?: string;
	name?: string;
	preventScroll?: boolean;
};

const defaults = {
	arrowSize: 8,
	required: false,
	disabled: false,
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
	preventScroll: true,
} satisfies Defaults<CreateSelectArgs>;

export type OptionArgs = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export function createSelect(args?: CreateSelectArgs) {
	const withDefaults = { ...defaults, ...args } as CreateSelectArgs;
	const options = writable(omit(withDefaults, 'value', 'label'));

	const open = writable(false);
	const value = writable<unknown>(withDefaults.value ?? null);
	const label = writable<string | number | null>(withDefaults.label ?? null);
	const activeTrigger = writable<HTMLElement | null>(null);

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

	const menu = {
		...derived([open], ([$open]) => {
			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
			};
		}),
		action: (node: HTMLElement) => {
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
								options: {
									floating: $options.positioning,
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
					/**
					 * Select should not be navigated using tab so we prevent it
					 */
					if (e.key === kbd.TAB) {
						e.preventDefault();
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
	};

	const trigger = {
		...derived([open, options], ([$open, $options]) => {
			return {
				role: 'combobox',
				'aria-autocomplete': 'none',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-required': $options.required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $options.disabled ? true : undefined,
				'data-melt-part': 'trigger',
				disabled: $options.disabled,
				id: ids.trigger,
			} as const;
		}),
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'pointerdown', (e) => {
					const $options = get(options);
					if ($options.disabled) {
						e.preventDefault();
						return;
					}

					const $open = get(open);
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					open.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
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

					e.preventDefault();
				})
			);

			return {
				destroy: unsub,
			};
		},
	};

	const { root: separator } = createSeparator({
		decorative: true,
	});

	const createGroup = () => {
		const groupId = generateId();

		const group = {
			role: 'group',
			'aria-labelledby': groupId,
		};

		const label = {
			id: groupId,
		};

		return {
			group,
			label,
		};
	};

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	const option = {
		...derived(value, ($value) => {
			return (args: OptionArgs) => {
				return {
					role: 'option',
					'aria-selected': $value === args?.value,
					'data-selected': $value === args?.value ? '' : undefined,
					'data-value': args.value,
					'data-label': args.label ?? undefined,
					'data-disabled': args.disabled ? '' : undefined,
					tabindex: -1,
				} as const;
			};
		}),
		action: (node: HTMLElement) => {
			const getElArgs = () => {
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
					const args = getElArgs();
					if (args.disabled) {
						e.preventDefault();
						return;
					}
				}),

				addEventListener(node, 'click', (e) => {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					const args = getElArgs();
					if (args.disabled) {
						e.preventDefault();
						return;
					}
					handleRovingFocus(itemElement);

					value.set(args.value);
					label.set(args.label);
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
						const args = getElArgs();
						node.setAttribute('data-selected', '');
						value.set(args.value);
						label.set(args.label);
						open.set(false);
					}
				}),
				addEventListener(node, 'pointermove', (e) => {
					const args = getElArgs();
					if (args.disabled) {
						e.preventDefault();
						return;
					}

					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					if (args.disabled) {
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
	};

	const { typed, handleTypeaheadSearch } = createTypeaheadSearch();

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		const unsubs: Array<() => void> = [];

		if (!isBrowser) return;
		const $options = get(options);
		if ($open && $options.preventScroll) {
			unsubs.push(removeScroll());
		}

		if (!$open && $activeTrigger) {
			handleRovingFocus($activeTrigger);
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
			} else {
				const triggerElement = document.getElementById(ids.trigger);
				if (!isHTMLElement(triggerElement)) return;

				handleRovingFocus(triggerElement);
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
				return;
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

	const input = derived([value, options], ([$value, $options]) => {
		return {
			type: 'hidden',
			name: $options.name,
			value: $value,
			'aria-hidden': true,
			hidden: true,
			tabIndex: -1,
			required: $options.required,
			disabled: $options.disabled,
			style: styleToString({
				position: 'absolute',
				opacity: 0,
				'pointer-events': 'none',
				margin: 0,
				transform: 'translateX(-100%)',
			}),
		};
	});

	function getOptions(element: HTMLElement): HTMLElement[] {
		return Array.from(element.querySelectorAll('[role="option"]'));
	}

	function isMouse(e: PointerEvent) {
		return e.pointerType === 'mouse';
	}

	function getFirstOption(menuElement: HTMLElement) {
		return menuElement.querySelector('[role="option"]');
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
		const options = getOptions(currentTarget);
		if (!options.length) return;

		const candidateNodes = options.filter((opt) => {
			if (opt.hasAttribute('data-disabled')) {
				return false;
			}
			if (opt.getAttribute('disabled') === 'true') {
				return false;
			}
			return true;
		});

		// Index of the currently focused item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);

		// Calculate the index of the next menu item
		let nextIndex: number;
		switch (e.key) {
			case kbd.ARROW_DOWN:
				nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : currentIndex;
				break;
			case kbd.ARROW_UP:
				nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
				break;
			case kbd.HOME:
				nextIndex = 0;
				break;
			case kbd.END:
				nextIndex = candidateNodes.length - 1;
				break;
			default:
				return;
		}

		const nextFocusedItem = candidateNodes[nextIndex];

		handleRovingFocus(nextFocusedItem);
	}

	return {
		trigger,
		menu,
		open,
		option,
		value,
		label,
		arrow,
		isSelected,
		options,
		input,
		separator,
		createGroup,
	};
}
