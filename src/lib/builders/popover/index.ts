import {
	effect,
	elementDerived,
	elementMultiDerived,
	isBrowser,
	kbd,
	sleep,
	styleToString,
} from '$lib/internal/helpers';

import {
	createFocusTrap,
	useFloating,
	useClickOutside,
	type FloatingConfig,
} from '$lib/internal/actions';

import { derived, readable, writable } from 'svelte/store';

export type CreatePopoverArgs = {
	positioning?: FloatingConfig;
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
	const positioning = readable(options.positioning);
	const arrowSize = readable(options.arrowSize);
	const open = writable(options.open);

	const activeTrigger = writable<HTMLElement | null>(null);

	const popover = elementDerived(
		[open, activeTrigger, positioning],
		([$open, $activeTrigger, $positioning], attach, addUnsubscriber) => {
			attach.getElement().then((popoverEl) => {
				if (!($open && $activeTrigger && popoverEl)) return;

				const floating = useFloating($activeTrigger, popoverEl, $positioning);

				const { deactivate, useFocusTrap } = createFocusTrap({
					immediate: true,
					escapeDeactivates: false,
					allowOutsideClick: true,
					returnFocusOnDeactivate: false,
					fallbackFocus: popoverEl,
				});

				const focusTrapAction = useFocusTrap(popoverEl);

				const clickOutsideAction = useClickOutside(popoverEl, {
					enabled: open,
					handler: (e: PointerEvent) => {
						if (e.defaultPrevented) return;

						if (!$activeTrigger?.contains(e.target as Element)) {
							open.set(false);
							$activeTrigger.focus();
						}
					},
				});

				addUnsubscriber([floating, focusTrapAction, clickOutsideAction, deactivate]);
			});

			attach('keydown', (e) => {
				if (!e.defaultPrevented) {
					switch (e.key) {
						case kbd.ESCAPE:
							open.set(false);
							break;
						default:
					}
				}
			});

			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
			};
		}
	);

	const trigger = elementMultiDerived([open, popover], ([$open, $popover], createAttach) => {
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
				'aria-controls': $popover['data-melt-id'],
			};
		};
	});

	const arrow = derived(arrowSize, ($arrowSize) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$arrowSize}px)`,
			height: `var(--arrow-size, ${$arrowSize}px)`,
		}),
	}));

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return { trigger, open, popover, arrow };
}
