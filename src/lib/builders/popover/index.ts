import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	styleToString,
} from '$lib/internal/helpers';
import { computePosition } from '@floating-ui/dom';
import { sleep } from '@melt-ui/svelte/internal/helpers/sleep';

export function createPopover() {
	const open = writable(false);
	const portal = writable('body');
	const activeTrigger = writable<HTMLElement | null>(null);

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
				role: 'button' as const,
				'aria-haspopup': 'dialog' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
			};
		};
	});

	const popover = elementDerived([open, activeTrigger], ([$open, $activeTrigger], attach) => {
		attach.getElement().then((popoverEl) => {
			if (!($open && $activeTrigger && popoverEl)) return;

			computePosition($activeTrigger, popoverEl).then((position) => {
				popoverEl.getBoundingClientRect();
				popoverEl.style.left = `${position.x}px`;
				popoverEl.style.top = `${position.y}px`;
			});
		});

		return {
			hidden: $open ? undefined : true,
			style: styleToString({
				display: $open ? undefined : 'none',
			}),
		};
	});

	effect([open, popover, activeTrigger], ([$open, $menu, $activeTrigger]) => {
		if (!isBrowser) return;

		const popoverEl = getElementByMeltId($menu['data-melt-id']);
		if (popoverEl && $open) {
			const firstFocusableChild = popoverEl.querySelector('[tabindex]:not([tabindex="-1"])') as
				| HTMLElement
				| undefined;
			if (firstFocusableChild) {
				sleep(1).then(() => firstFocusableChild?.focus());
			} else {
				sleep(1).then(() => popoverEl.focus());
			}
		} else if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return { trigger, open, popover };
}
