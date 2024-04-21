import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	getPortalDestination,
	handleFocus,
	isBrowser,
	isElement,
	kbd,
	noop,
	omit,
	overridable,
	removeScroll,
	styleToString,
	toWritableStores,
	portalAttr,
	generateIds,
	withGet,
} from '$lib/internal/helpers/index.js';

import { usePopper, usePortal, type InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { writable } from 'svelte/store';
import type { PopoverEvents } from './events.js';
import type { CreatePopoverProps } from './types.js';
import { tick } from 'svelte';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	defaultOpen: false,
	disableFocusTrap: false,
	escapeBehavior: 'close',
	preventScroll: false,
	onOpenChange: undefined,
	closeOnOutsideClick: true,
	portal: undefined,
	forceVisible: false,
	openFocus: undefined,
	closeFocus: undefined,
	onOutsideClick: undefined,
	preventTextSelectionOverflow: true,
} satisfies Defaults<CreatePopoverProps>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close' | 'overlay';
const { name } = createElHelpers<PopoverParts>('popover');

export const popoverIdParts = ['trigger', 'content'] as const;
export type PopoverIdParts = typeof popoverIdParts;

export function createPopover(args?: CreatePopoverProps) {
	const withDefaults = { ...defaults, ...args } satisfies CreatePopoverProps;

	const options = toWritableStores(omit(withDefaults, 'open', 'ids'));
	const {
		positioning,
		arrowSize,
		disableFocusTrap,
		preventScroll,
		escapeBehavior,
		closeOnOutsideClick,
		portal,
		forceVisible,
		openFocus,
		closeFocus,
		onOutsideClick,
		preventTextSelectionOverflow,
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = withGet.writable<HTMLElement | null>(null);

	const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });

	function handleClose() {
		open.set(false);
	}

	const isVisible = derivedVisible({ open, activeTrigger, forceVisible });

	const content = makeElement(name('content'), {
		stores: [isVisible, open, activeTrigger, portal, ids.content],
		returned: ([$isVisible, $open, $activeTrigger, $portal, $contentId]) => {
			return {
				hidden: $isVisible && isBrowser ? undefined : true,
				tabindex: -1,
				style: $isVisible ? undefined : styleToString({ display: 'none' }),
				id: $contentId,
				'data-state': $open && $activeTrigger ? 'open' : 'closed',
				'data-portal': portalAttr($portal),
			} as const;
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[isVisible, activeTrigger, positioning, disableFocusTrap, closeOnOutsideClick, portal],
				([
					$isVisible,
					$activeTrigger,
					$positioning,
					$disableFocusTrap,
					$closeOnOutsideClick,
					$portal,
				]) => {
					unsubPopper();
					if (!$isVisible || !$activeTrigger) return;

					tick().then(() => {
						unsubPopper();
						unsubPopper = usePopper(node, {
							anchorElement: $activeTrigger,
							open,
							options: {
								floating: $positioning,
								focusTrap: $disableFocusTrap ? null : undefined,
								modal: {
									shouldCloseOnInteractOutside: shouldCloseOnInteractOutside,
									onClose: handleClose,
									closeOnInteractOutside: $closeOnOutsideClick,
								},
								escapeKeydown: { behaviorType: escapeBehavior },
								portal: getPortalDestination(node, $portal),
								preventTextSelectionOverflow: { enabled: preventTextSelectionOverflow },
							},
						}).destroy;
					});
				}
			);

			return {
				destroy() {
					unsubDerived();
					unsubPopper();
				},
			};
		},
	});

	function toggleOpen() {
		open.update((prev) => !prev);
	}
	function shouldCloseOnInteractOutside(e: InteractOutsideEvent) {
		onOutsideClick.get()?.(e);
		if (e.defaultPrevented) return false;
		const target = e.target;
		const triggerEl = document.getElementById(ids.trigger.get());

		if (triggerEl && isElement(target)) {
			if (target === triggerEl || triggerEl.contains(target)) return false;
		}
		return true;
	}

	const trigger = makeElement(name('trigger'), {
		stores: [isVisible, ids.content, ids.trigger],
		returned: ([$isVisible, $contentId, $triggerId]) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $isVisible ? 'true' : 'false',
				'data-state': stateAttr($isVisible),
				'aria-controls': $contentId,
				id: $triggerId,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<PopoverEvents['trigger']> => {
			activeTrigger.set(node);
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', toggleOpen),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					toggleOpen();
				})
			);

			return {
				destroy() {
					activeTrigger.set(null);
					unsub();
				},
			};
		},
	});

	const overlay = makeElement(name('overlay'), {
		stores: [isVisible],
		returned: ([$isVisible]) => {
			return {
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				'aria-hidden': 'true',
				'data-state': stateAttr($isVisible),
			} as const;
		},
		action: (node: HTMLElement) => {
			let unsubDerived = noop;
			let unsubPortal = noop;

			unsubDerived = effect([portal], ([$portal]) => {
				unsubPortal();
				if ($portal === null) return;
				const portalDestination = getPortalDestination(node, $portal);
				if (portalDestination === null) return;
				unsubPortal = usePortal(node, portalDestination).destroy;
			});

			return {
				destroy() {
					unsubDerived();
					unsubPortal();
				},
			};
		},
	});

	const arrow = makeElement(name('arrow'), {
		stores: arrowSize,
		returned: ($arrowSize) =>
			({
				'data-arrow': true,
				style: styleToString({
					position: 'absolute',
					width: `var(--arrow-size, ${$arrowSize}px)`,
					height: `var(--arrow-size, ${$arrowSize}px)`,
				}),
			} as const),
	});

	const close = makeElement(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement): MeltActionReturn<PopoverEvents['close']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					if (e.defaultPrevented) return;
					handleClose();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.defaultPrevented) return;
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					toggleOpen();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
		if (!isBrowser || !$open) return;

		const unsubs: Array<() => void> = [];

		if ($preventScroll) {
			unsubs.push(removeScroll());
		}
		handleFocus({ prop: openFocus.get(), defaultEl: $activeTrigger });

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	effect(
		open,
		($open) => {
			if (!isBrowser || $open) return;
			const triggerEl = document.getElementById(ids.trigger.get());
			handleFocus({ prop: closeFocus.get(), defaultEl: triggerEl });
		},
		{ skipFirstRun: true }
	);

	return {
		ids,
		elements: {
			trigger,
			content,
			arrow,
			close,
			overlay,
		},
		states: {
			open,
		},
		options,
	};
}

function stateAttr(open: boolean) {
	return open ? 'open' : 'closed';
}
