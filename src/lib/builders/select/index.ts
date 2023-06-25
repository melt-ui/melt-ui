import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	addEventListener,
	debounce,
	effect,
	executeCallbacks,
	generateId,
	isBrowser,
	kbd,
	noop,
	omit,
	styleToString,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import type { Defaults } from '$lib/internal/types';
import { onMount, tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';

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
};

const defaults = {
	arrowSize: 8,
	required: false,
	disabled: false,
	positioning: {
		placement: 'bottom',
		sameWidth: true,
	},
} satisfies Defaults<CreateSelectArgs>;

export function createSelect(args?: CreateSelectArgs) {
	const withDefaults = { ...defaults, ...args } as CreateSelectArgs;
	const options = writable(omit(withDefaults, 'value', 'label'));

	const open = writable(false);
	const value = writable<unknown>(withDefaults.value ?? null);
	const label = writable<string | number | null>(withDefaults.label ?? null);
	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		menu: generateId(),
		trigger: generateId(),
	};

	onMount(() => {
		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);
		if (!menuEl) return;

		const selectedEl = menuEl.querySelector('[data-selected]') as HTMLElement | undefined;
		if (!selectedEl) return;
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

			return {
				destroy() {
					unsubDerived();
					unsubPopper();
				},
			};
		},
	};

	const trigger = {
		...derived([open, options], ([$open, $options]) => {
			return {
				role: 'combobox',
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-required': $options.required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $options.disabled ? true : undefined,
				disabled: $options.disabled,
				id: ids.trigger,
			};
		}),
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					const $options = get(options);
					if ($options.disabled) return;
					e.stopPropagation();
					const triggerEl = e.currentTarget as HTMLElement;
					open.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							activeTrigger.set(triggerEl);
						} else {
							activeTrigger.set(null);
						}

						return isOpen;
					});
				}),

				addEventListener(node, 'mousedown', (e) => {
					e.preventDefault();
				}),

				addEventListener(node, 'keydown', (e) => {
					const $options = get(options);
					if ($options.disabled) return;
					if ([kbd.ENTER, kbd.SPACE, kbd.ARROW_DOWN, kbd.ARROW_UP].includes(e.key)) {
						e.preventDefault();
						open.set(true);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	};

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	type OptionArgs = {
		value: unknown;
		label?: string;
		disabled?: boolean;
	};

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
					tabindex: 0,
				};
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
					disabled: !disabled,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'click', () => {
					const args = getElArgs();
					value.set(args.value);
					label.set(args.label);
					open.set(false);
				}),

				addEventListener(node, 'keydown', (e) => {
					if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						const args = getElArgs();
						value.set(args.value);
						label.set(args.label);
						open.set(false);
					}
				}),

				addEventListener(node, 'mousemove', () => {
					node.focus();
				}),

				addEventListener(node, 'mouseout', () => {
					node.blur();
				})
			);

			return {
				destroy: unsub,
			};
		},
	};

	let typed: string[] = [];
	const resetTyped = debounce(() => {
		typed = [];
	});

	effect([open, activeTrigger, menu], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		const menuEl = document.getElementById(ids.menu);
		if (menuEl && $open) {
			// Focus on selected option or first option
			const selectedOption = menuEl.querySelector('[data-selected]') as HTMLElement | undefined;
			if (!selectedOption) {
				const firstOption = menuEl.querySelector('[role="option"]') as HTMLElement | undefined;
				sleep(1).then(() => firstOption?.focus());
			} else {
				sleep(1).then(() => selectedOption.focus());
			}
		} else if (!$open && $activeTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	const isSelected = derived([value], ([$value]) => {
		return (value: string | number) => {
			return $value === value;
		};
	});

	onMount(() => {
		const keydownListener = (e: KeyboardEvent) => {
			const menuEl = document.getElementById(ids.menu);
			if (!menuEl || menuEl.hidden) return;

			if (e.key === kbd.ESCAPE) {
				open.set(false);
				activeTrigger.set(null);
				return;
			}

			const allOptions = Array.from(menuEl.querySelectorAll('[role="option"]')) as HTMLElement[];
			const focusedOption = allOptions.find((el) => el === document.activeElement);
			const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

			if (e.key === kbd.ARROW_DOWN) {
				e.preventDefault();
				const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
				const nextOption = allOptions[nextIndex] as HTMLElement;
				nextOption.focus();
				return;
			} else if (e.key === kbd.ARROW_UP) {
				e.preventDefault();
				const prevIndex = focusedIndex - 1 < 0 ? allOptions.length - 1 : focusedIndex - 1;
				const prevOption = allOptions[prevIndex] as HTMLElement;
				prevOption.focus();
				return;
			} else if (e.key === kbd.HOME) {
				e.preventDefault();
				const firstOption = allOptions[0] as HTMLElement;
				firstOption.focus();
				return;
			} else if (e.key === kbd.END) {
				e.preventDefault();
				const lastOption = allOptions[allOptions.length - 1] as HTMLElement;
				lastOption.focus();
				return;
			}

			// Typeahead
			const isAlphaNumericOrSpace = /^[a-z0-9 ]$/i.test(e.key);
			if (isAlphaNumericOrSpace) {
				typed.push(e.key.toLowerCase());
				const typedString = typed.join('');
				const matchingOption = allOptions.find((el) =>
					el.innerText.toLowerCase().startsWith(typedString)
				);
				if (matchingOption) {
					matchingOption.focus();
				}

				resetTyped();
			}
		};

		document.addEventListener('keydown', keydownListener);

		return () => {
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
	};
}
