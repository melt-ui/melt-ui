import { usePopper } from '$lib/internal/actions/popper';
import {
	debounce,
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	styleToString,
	uuid,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import type { FloatingConfig } from '$lib/internal/actions';
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

type CreateSelectArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
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
} satisfies CreateSelectArgs;

export function createSelect(args?: CreateSelectArgs) {
	const withDefaults = { ...defaults, ...args } as CreateSelectArgs;
	const options = writable({ ...withDefaults });

	const open = writable(false);
	const selected = writable<string | null>(null);
	const selectedText = writable<string | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);
	const triggerId = uuid();

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
				'aria-labelledby': triggerId,
			};
		}
	);

	const menuId = derived(menu, ($menu) => $menu['data-melt-id']);

	const trigger = elementDerived(
		[open, menuId, options],
		([$open, $menuId, $options], { attach }) => {
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

			return {
				role: 'combobox',
				'aria-controls': $menuId,
				'aria-expanded': $open,
				'aria-required': $options.required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $options.disabled ? '' : undefined,
				id: triggerId,
			};
		}
	);

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	type OptionArgs = {
		value: string;
	};

	const option = elementMultiDerived([selected], ([$selected], { attach }) => {
		return ({ value }: OptionArgs) => {
			attach('click', (e) => {
				const el = e.currentTarget as HTMLElement;
				selected.set(value);
				selectedText.set(el.innerText);
				open.set(false);
			});

			attach('keydown', (e) => {
				if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
					e.stopPropagation();
					e.stopImmediatePropagation();
					const el = e.currentTarget as HTMLElement;
					selected.set(value);
					selectedText.set(el.innerText);
					open.set(false);
				}
			});

			attach('mouseover', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.focus();
			});

			attach('mouseout', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.blur();
			});

			return {
				role: 'option',
				'aria-selected': $selected === value,
				'data-selected': $selected === value ? '' : undefined,
				tabindex: 0,
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
				const firstOption = menuEl.querySelector('[role="option"]') as HTMLElement | undefined;
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
		} else if (!$open && $activeTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	const isSelected = derived(
		[selected],
		([$selected]) =>
			(value: string) =>
				$selected === value
	);

	return { trigger, menu, open, option, selected, selectedText, arrow, isSelected, options };
}
