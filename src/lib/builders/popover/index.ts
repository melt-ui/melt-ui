import {
	createFocusTrap,
	effect,
	elementDerived,
	elementMultiDerived,
	getPlacement,
	isBrowser,
	sleep,
	styleToString,
	useClickOutside,
	type PositionOptions,
} from '$lib/internal/helpers';
import { derived, writable } from 'svelte/store';

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
		([$open, $activeTrigger, $positioning], attach, addUnsubscriber) => {
			attach.getElement().then((popoverEl) => {
				if (!($open && $activeTrigger && popoverEl)) return;

				const placement = getPlacement($activeTrigger, popoverEl, $positioning);

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

				addUnsubscriber([placement, focusTrapAction, clickOutsideAction, deactivate]);
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
