import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	debounce,
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	omit,
	styleToString,
	uuid,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import type { Defaults } from '$lib/internal/types';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';

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

export type CreateSelectArgs<T = unknown> = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	selected?: T;
	name?: string;
};

export type SelectOptionArgs<T = unknown> = {
	value: T;
	label?: string;
	disabled?: boolean;
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
	const options = writable(omit(withDefaults, 'selected'));

	const open = writable(false);
	const selected = writable<unknown>(withDefaults.selected ?? null);
	const selectedText = writable<string | number | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		menu: uuid(),
		trigger: uuid(),
	};

	onMount(() => {
		if (!isBrowser) return;
		const menuEl = document.getElementById(ids.menu);
		if (!menuEl) return;

		const selectedEl = menuEl.querySelector('[data-selected]') as HTMLElement | undefined;
		if (!selectedEl) return;
		const label = selectedEl.getAttribute('data-label');
		selectedText.set(label ?? selectedEl.textContent ?? null);
	});

	const menu = elementDerived(
		[open, activeTrigger, options],
		([$open, $activeTrigger, $options], { addAction }) => {
			if ($open && $activeTrigger) {
				addAction(usePopper, {
					anchorElement: $activeTrigger,
					open,
					options: {
						floating: $options.positioning,
					},
				});
			}

			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
			};
		}
	);

	const trigger = elementDerived([open, options], ([$open, $options], { attach }) => {
		attach('click', (e) => {
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
		});

		attach('mousedown', (e) => {
			e.preventDefault();
		});

		return {
			role: 'combobox',
			'aria-controls': ids.menu,
			'aria-expanded': $open,
			'aria-required': $options.required,
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $options.disabled ? '' : undefined,
			id: ids.trigger,
		};
	});

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	const option = elementMultiDerived([selected], ([$selected], { attach }) => {
		return (args: SelectOptionArgs) => {
			const { value, label, disabled } = args;

			if (!disabled) {
				attach('click', (e) => {
					const el = e.currentTarget as HTMLElement | null;
					selected.set(value);
					selectedText.set(label ?? el?.textContent ?? null);
					open.set(false);
				});

				attach('keydown', (e) => {
					const el = e.currentTarget as HTMLElement | null;
					if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
						e.preventDefault();
						selected.set(value);
						selectedText.set(label ?? el?.textContent ?? null);
						open.set(false);
					}
				});

				attach('mousemove', (e) => {
					const el = e.currentTarget as HTMLElement;
					el.focus();
				});

				attach('mouseout', (e) => {
					const el = e.currentTarget as HTMLElement;
					el.blur();
				});
			}

			return {
				role: 'option',
				'aria-selected': $selected === value,
				'data-selected': $selected === value ? '' : undefined,
				'data-label': label ?? undefined,
				'data-disabled': disabled ? '' : undefined,
				disabled: disabled ? true : undefined,
				tabindex: disabled ? -1 : 0,
			};
		};
	});

	let typed: string[] = [];
	const resetTyped = debounce(() => {
		typed = [];
	});

	effect([open, menu, activeTrigger], ([$open, $menu, $activeTrigger]) => {
		if (!isBrowser) return;

		const menuEl = getElementByMeltId($menu['data-melt-id']);
		if (menuEl && $open) {
			// Focus on selected option or first option
			const selectedOption = menuEl.querySelector('[data-selected]') as HTMLElement | undefined;
			if (!selectedOption) {
				// get first non-disabled option
				const firstOption = menuEl.querySelector('[role="option"]:not([data-disabled])') as
					| HTMLElement
					| undefined;
				sleep(1).then(() => firstOption?.focus());
			} else {
				sleep(1).then(() => selectedOption.focus());
			}

			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === kbd.ESCAPE) {
					open.set(false);
					activeTrigger.set(null);
					return;
				}

				const allOptions = Array.from(
					menuEl.querySelectorAll('[role="option"]:not([data-disabled])')
				) as HTMLElement[];
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
		} else if (!$open && $activeTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	const isSelected = derived([selected], ([$selected]) => {
		return (value: string | number) => {
			return $selected === value;
		};
	});

	const input = derived([selected, options], ([$selected, $options]) => {
		return {
			type: 'hidden',
			name: $options.name,
			value: $selected,
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

	return { trigger, menu, open, option, selected, selectedText, arrow, isSelected, options, input };
}
