import { usePopper } from '$lib/internal/actions/popper';
import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	styleToString,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import type { FloatingConfig } from '$lib/internal/actions';
import { writable } from 'svelte/store';

/**
 * Features:
 * - [ ] Click outside
 * - [ ] Keyboard navigation
 * - [ ] Focus management
 * - [ ] A11y
 * - [ ] Floating UI
 **/

type CreateSelectArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
};

const defaults = {
	positioning: {
		placement: 'bottom',
	},
} satisfies CreateSelectArgs;

export function createSelect(args?: CreateSelectArgs) {
	const withDefaults = { ...defaults, ...args } as CreateSelectArgs;
	const options = writable({ ...withDefaults });

	const open = writable(false);
	const selected = writable<string | null>(null);
	const selectedText = writable<string | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);

	const trigger = elementMultiDerived([open], (_, { createAttach }) => {
		return () => {
			const attach = createAttach();
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
				role: 'button',
			};
		};
	});

	const menu = elementDerived(
		[open, activeTrigger, options],
		([$open, $activeTrigger, $options], { attach, addUnsubscriber }) => {
			attach.getElement().then((menuEl) => {
				if (!($open && $activeTrigger && menuEl)) return;

				const { unsubscribe } = usePopper({
					anchorElement: $activeTrigger,
					popperElement: menuEl,
					open,
					attach,
					options: {
						floating: $options.positioning,
					},
				});

				addUnsubscriber([unsubscribe]);
			});

			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
			};
		}
	);

	type OptionArgs = {
		value: string;
	};

	const option = elementMultiDerived([selected], ([$selected], { createAttach }) => {
		return ({ value }: OptionArgs) => {
			const attach = createAttach();
			attach('click', (e) => {
				const el = e.currentTarget as HTMLElement;
				selected.set(value);
				selectedText.set(el.innerText);
				open.set(false);
			});

			attach('keydown', (e) => {
				if (e.key === kbd.ENTER) {
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

				const allOptions = Array.from(menuEl.querySelectorAll('[role="option"]'));
				const focusedOption = allOptions.find((el) => el === document.activeElement);
				const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

				if (e.key === kbd.ARROW_DOWN) {
					e.preventDefault();
					const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
					const nextOption = allOptions[nextIndex] as HTMLElement;
					nextOption.focus();
				} else if (e.key === kbd.ARROW_UP) {
					e.preventDefault();
					const prevIndex = focusedIndex - 1 < 0 ? allOptions.length - 1 : focusedIndex - 1;
					const prevOption = allOptions[prevIndex] as HTMLElement;
					prevOption.focus();
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

	return { trigger, menu, open, option, selected, selectedText };
}
