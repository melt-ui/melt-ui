import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	getPlacement,
	isBrowser,
	styleToString,
	sleep,
	type PositionOptions,
} from '$lib/internal/helpers';

type CreatePopoverArgs = {
	positioning?: PositionOptions;
	arrowSize?: number;
	open?: boolean;
};

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
} satisfies CreatePopoverArgs;

export function createPopover(args?: CreatePopoverArgs) {
	const options = { ...defaults, ...args } as CreatePopoverArgs;
	const positioning = writable(options.positioning);
	const arrowSize = writable(options.arrowSize);
	const open = writable(options.open);

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

	const popover = elementDerived(
		[open, activeTrigger, positioning],
		([$open, $activeTrigger, $positioning], attach) => {
			attach.getElement().then((popoverEl) => {
				if (!($open && $activeTrigger && popoverEl)) return;

				// TODO: Determine if this is okay or are we creating a memory leak/a ton of listeners
				// if not okay, need to determine what the best approach is for calling a function onDestroy
				getPlacement($activeTrigger, popoverEl, $positioning);
			});

			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
			};
		}
	);

	const arrow = derived(arrowSize, ($arrowSize) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$arrowSize}px)`,
			height: `var(--arrow-size, ${$arrowSize}px)`,
		}),
	}));

	effect([open, popover, activeTrigger], ([$open, $menu, $activeTrigger]) => {
		if (!isBrowser) return;

		const popoverEl = getElementByMeltId($menu['data-melt-id']);
		if (popoverEl && $open) {
			if ($activeTrigger) {
				getPlacement($activeTrigger, popoverEl);
			}
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

	return { trigger, open, popover, arrow };
}
