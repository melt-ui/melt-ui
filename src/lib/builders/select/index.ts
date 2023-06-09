import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	styleToString,
} from '$lib/internal/helpers';
import { sleep } from '$lib/internal/helpers/sleep';
import { computePosition } from '@floating-ui/dom';
import { onMount, tick } from 'svelte';
import { writable } from 'svelte/store';

/**
 * Features:
 * - [ ] Click outside
 * - [ ] Keyboard navigation
 * - [ ] Focus management
 * - [ ] A11y
 * - [ ] Floating UI
 **/

export function createSelect() {
	const open = writable(false);
	const selected = writable<string | null>(null);
	const selectedText = writable<string | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);

	// Dumb click outside
	onMount(() => {
		const listener = () => {
			open.set(false);
		};

		if (isBrowser) {
			document.addEventListener('click', listener);
		}

		return () => {
			if (isBrowser) {
				document.removeEventListener('click', listener);
			}
		};
	});

	const trigger = elementMultiDerived([open], ([$open], createAttach) => {
		return () => {
			const attach = createAttach();
			attach('click', (e) => {
				console.log('click', $open);
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

	const menu = elementDerived([open, activeTrigger], ([$open, $activeTrigger], attach) => {
		attach.getElement().then((menuEl) => {
			if (!($open && $activeTrigger && menuEl)) return;

			computePosition($activeTrigger, menuEl).then((position) => {
				menuEl.getBoundingClientRect();
				menuEl.style.left = `${position.x}px`;
				menuEl.style.top = `${position.y}px`;
			});
		});

		return {
			hidden: $open ? undefined : true,
			style: styleToString({
				display: $open ? undefined : 'none',
			}),
		};
	});

	type OptionArgs = {
		value: string;
	};

	const option = elementMultiDerived([open, selected], ([$open, $selected], createAttach) => {
		return ({ value }: OptionArgs) => {
			const attach = createAttach();
			attach('click', (e) => {
				const el = e.currentTarget as HTMLElement;
				selected.set(value);
				selectedText.set(el.innerText);
				open.set(false);
			});

			attach('keydown', (e) => {
				if (e.key === 'Enter') {
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
				if (e.key === 'Escape') {
					open.set(false);
					activeTrigger.set(null);
					return;
				}

				const allOptions = Array.from(menuEl.querySelectorAll('[role="option"]'));
				const focusedOption = allOptions.find((el) => el === document.activeElement);
				const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

				if (e.key === 'ArrowDown') {
					e.preventDefault();
					const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
					const nextOption = allOptions[nextIndex] as HTMLElement;
					nextOption.focus();
				} else if (e.key === 'ArrowUp') {
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
