import { elementDerived, elementMultiDerived, styleToString } from '$lib/internal/helpers';
import { computePosition } from '@floating-ui/dom';
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
	const activeTrigger = writable<HTMLElement | null>(null);

	// Dumb click outside
	// if (isBrowser) {
	// 	document.addEventListener('click', (e) => {
	// 		open.set(false);
	// 	});
	// }

	const trigger = elementMultiDerived([], (_, createAttach) => {
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
			attach('click', () => {
				selected.set(value);
				open.set(false);
			});

			return {
				role: 'option',
				'aria-selected': $selected === value,
			};
		};
	});

	return { trigger, menu, open, option, selected };
}
