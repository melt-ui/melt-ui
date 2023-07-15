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
	isMouse,
	kbd,
	last,
	next,
	noop,
	omit,
	prev,
	removeScroll,
	styleToString,
} from '$lib/internal/helpers';
import { getFirstOption, getOptions } from '$lib/internal/helpers/list';
import { sleep } from '$lib/internal/helpers/sleep';
import { onMount, tick } from 'svelte';
import { derived, get, writable, type Writable } from 'svelte/store';
import { createSeparator } from '../separator';
import type { CreateSelectProps, SelectOptionProps } from './types';
import { addHighlight, removeHighlight } from '../menu';

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
	type: 'single',
	defaultValue: '',
} satisfies CreateSelectProps;

type SelectParts = 'menu' | 'trigger' | 'option' | 'group' | 'group-label' | 'arrow' | 'input';
const { name } = createElHelpers<SelectParts>('select');

export function createSelect(props?: CreateSelectProps) {
	const withDefaults = { ...defaults, ...props } as CreateSelectProps;

	const open = writable(false);
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

	if (withDefaults.type === 'single') {
		let options: Writable<Omit<CreateSelectProps, 'label' | 'value' | 'defaultValue'>>;
		if (withDefaults.value) {
			options = writable(omit(withDefaults, 'label', 'value'));
		} else {
			options = writable(omit(withDefaults, 'label', 'defaultValue'));
		}

		const value = withDefaults.value ? withDefaults.value : writable(withDefaults.defaultValue);

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
				};
			},
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
							handleSingleMenuNavigation(e, get(options).loop ?? false);
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
			stores: [open, options],

			returned: ([$open, $options]) => {
				return {
					role: 'combobox',
					'aria-autocomplete': 'none',
					'aria-controls': ids.menu,
					'aria-expanded': $open,
					'aria-required': $options.required,
					'data-state': $open ? 'open' : 'closed',
					'data-disabled': $options.disabled ? true : undefined,
					disabled: $options.disabled,
					id: ids.trigger,
					tabindex: 0,
				} as const;
			},
			action: (node: HTMLElement) => {
				const unsub = executeCallbacks(
					addEventListener(node, 'click', (e) => {
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

		const { root: separator } = createSeparator({
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
			stores: options,
			returned: ($options) => ({
				'data-arrow': true,
				style: styleToString({
					position: 'absolute',
					width: `var(--arrow-size, ${$options.arrowSize}px)`,
					height: `var(--arrow-size, ${$options.arrowSize}px)`,
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
			const $options = get(options);
			if ($open && $options.preventScroll) {
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
			stores: [value, options],
			returned: ([$value, $options]) => {
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
			},
		});

		return {
			options,
			open,
			isSelected,
			value,
			trigger,
			menu,
			option,
			input,
			label,
			separator,
			group,
			groupLabel,
			arrow,
		};
	} else {
		let options: Writable<Omit<CreateSelectProps, 'label' | 'value' | 'defaultValue'>>;
		if (withDefaults.value) {
			options = writable(omit(withDefaults, 'label', 'value'));
		} else {
			options = writable(omit(withDefaults, 'label', 'defaultValue'));
		}

		const value = withDefaults.value
			? withDefaults.value
			: writable(withDefaults.defaultValue ?? []);

		const currentlySelectedLabels = writable<string[]>([]);

		onMount(() => {
			if (!isBrowser) return;
			const menuEl = document.getElementById(ids.menu);
			if (!menuEl) return;

			const selectedEls = Array.from(menuEl.querySelectorAll<HTMLElement>('[data-selected]'));
			if (!selectedEls.length) return;

			const dataLabels = selectedEls.map((selectedEl) => {
				const dataLabel = selectedEl.getAttribute('data-label');
				if (dataLabel) {
					return dataLabel;
				}
				return selectedEl.textContent ?? null;
			});
			currentlySelectedLabels.set(dataLabels.filter((label): label is string => label !== null));

			label.set(dataLabels.join(', '));
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
				};
			},
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
							handleMultipleMenuNavigation(e, get(options).loop ?? false, value);
						}

						if (!isModifierKey && isCharacterKey) {
							handleTypeaheadSearch(e.key, getOptions(node));
						}

						if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
							const allOptionValues = getAllOptionValues(node);
							if (allOptionValues.length) {
								e.preventDefault();
								value.set(allOptionValues);
							}
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
			stores: [open, options],

			returned: ([$open, $options]) => {
				return {
					role: 'combobox',
					'aria-autocomplete': 'none',
					'aria-controls': ids.menu,
					'aria-expanded': $open,
					'aria-required': $options.required,
					'data-state': $open ? 'open' : 'closed',
					'data-disabled': $options.disabled ? true : undefined,
					disabled: $options.disabled,
					id: ids.trigger,
					tabindex: 0,
				} as const;
			},
			action: (node: HTMLElement) => {
				const unsub = executeCallbacks(
					addEventListener(node, 'click', (e) => {
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

		const { root: separator } = createSeparator({
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
			stores: options,
			returned: ($options) => ({
				'data-arrow': true,
				style: styleToString({
					position: 'absolute',
					width: `var(--arrow-size, ${$options.arrowSize}px)`,
					height: `var(--arrow-size, ${$options.arrowSize}px)`,
				}),
			}),
		});

		const option = builder(name('option'), {
			stores: value,
			returned: ($value) => {
				return (props: SelectOptionProps) => {
					return {
						role: 'option',
						'aria-selected': $value.includes(props.value),
						'data-selected': $value.includes(props.value) ? '' : undefined,
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
					const selected = node.hasAttribute('data-selected');

					return {
						value,
						label: label ?? node.textContent ?? null,
						disabled: disabled ? true : false,
						selected,
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

						value.update((prev) => {
							if (prev.includes(props.value)) {
								return prev.filter((v) => v !== props.value);
							}
							return [...prev, props.value];
						});

						currentlySelectedLabels.update((prev) => {
							const optionLabel = props.label ?? node.textContent ?? '';
							if (prev.length && prev.includes(optionLabel)) {
								const newLabels = prev.filter((v) => v !== optionLabel);

								label.set(newLabels.join(', '));

								return prev.filter((v) => v !== optionLabel);
							}
							label.set([...prev, optionLabel].join(', '));
							return [...prev, optionLabel];
						});
					}),

					addEventListener(node, 'keydown', (e) => {
						const $typed = get(typed);
						const isTypingAhead = $typed.length > 0 && $typed[0] !== kbd.SPACE;
						if (isTypingAhead && e.key === kbd.SPACE) {
							e.preventDefault();
							return;
						}
						if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
							e.preventDefault();
							const props = getElprops();

							value.update((prev) => {
								if (prev.includes(props.value)) {
									return prev.filter((v) => v !== props.value);
								}
								return [...prev, props.value];
							});
							label.update((prev) => {
								const label = props.label ?? node.textContent ?? '';
								if (prev) {
									return prev + ', ' + label;
								}
								return label;
							});
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
						addHighlight(itemElement);
					}),
					addEventListener(node, 'focusout', (e) => {
						const itemElement = e.currentTarget;
						if (!isHTMLElement(itemElement)) return;
						removeHighlight(itemElement);
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
			const $options = get(options);
			if ($open && $options.preventScroll) {
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
				return $value.includes(value);
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
			stores: [value, options],
			returned: ([$value, $options]) => {
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
			},
		});

		return {
			options,
			open,
			isSelected,
			value,
			trigger,
			menu,
			option,
			input,
			label,
			separator,
			group,
			groupLabel,
			arrow,
		};
	}

	function getSelectedOption(menuElement: HTMLElement) {
		return menuElement.querySelector('[data-selected]');
	}

	function getAllOptionValues(menuElement: HTMLElement) {
		const options = Array.from(
			menuElement.querySelectorAll<HTMLElement>('[data-melt-select-option]')
		);
		const candidateOptions = options.filter((option) => !option.hasAttribute('data-disabled'));

		const allValues = candidateOptions.map((option) => {
			const itemValue = option.getAttribute('data-value');
			if (itemValue) return itemValue;
		});

		return allValues.filter((value): value is string => typeof value === 'string');
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
	function handleMenuNavigation(e: KeyboardEvent, loop: boolean) {
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
		return nextItem;
	}

	function handleSingleMenuNavigation(e: KeyboardEvent, loop: boolean) {
		const nextItem = handleMenuNavigation(e, loop);
		if (!nextItem) return;

		handleRovingFocus(nextItem);
	}

	function handleMultipleMenuNavigation(
		e: KeyboardEvent,
		loop: boolean,
		valueStore: Writable<unknown[]>
	) {
		const nextItem = handleMenuNavigation(e, loop);
		if (!nextItem) return;

		if (e.shiftKey) {
			handleRovingFocus(nextItem);
			valueStore.update((prev) => {
				const value = nextItem.dataset.value;
				if (!value) return prev;
				if (prev.includes(value)) {
					return prev.filter((v) => v !== value);
				}
				return [...prev, value];
			});
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
}
