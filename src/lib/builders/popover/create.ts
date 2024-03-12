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
} from '$lib/internal/helpers/index.js';

import { usePopper, usePortal, type InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { writable } from 'svelte/store';
import type { PopoverEvents } from './events.js';
import type { CreatePopoverProps } from './types.js';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	defaultOpen: false,
	disableFocusTrap: false,
	closeOnEscape: true,
	preventScroll: false,
	onOpenChange: undefined,
	closeOnOutsideClick: true,
	portal: undefined,
	forceVisible: false,
	openFocus: undefined,
	closeFocus: undefined,
	onOutsideClick: undefined,
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
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		forceVisible,
		openFocus,
		closeFocus,
		onOutsideClick,
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });

	function handleClose() {
		open.set(false);
		const triggerEl = document.getElementById(ids.trigger.get());
		handleFocus({ prop: closeFocus.get(), defaultEl: triggerEl });
	}

	const isVisible = derivedVisible({ open, activeTrigger, forceVisible });

	const content = makeElement(name('content'), {
		stores: [isVisible, portal, ids.content],
		returned: ([$isVisible, $portal, $contentId]) => {
			return {
				hidden: $isVisible && isBrowser ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: $contentId,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': portalAttr($portal),
			};
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[
					isVisible,
					activeTrigger,
					positioning,
					disableFocusTrap,
					closeOnEscape,
					closeOnOutsideClick,
					portal,
				],
				([
					$isVisible,
					$activeTrigger,
					$positioning,
					$disableFocusTrap,
					$closeOnEscape,
					$closeOnOutsideClick,
					$portal,
				]) => {
					unsubPopper();
					if (!$isVisible || !$activeTrigger) return;

					tick().then(() => {
						const popper = usePopper(node, {
							anchorElement: $activeTrigger,
							open,
							options: {
								floating: $positioning,
								focusTrap: $disableFocusTrap
									? null
									: {
											returnFocusOnDeactivate: false,
											clickOutsideDeactivates: true,
											escapeDeactivates: true,
									  },
								modal: {
									shouldCloseOnInteractOutside: shouldCloseOnInteractOutside,
									onClose: handleClose,
									open: $isVisible,
									closeOnInteractOutside: $closeOnOutsideClick,
								},
								escapeKeydown: { handler: handleClose, enabled: $closeOnEscape },
								portal: getPortalDestination(node, $portal),
							},
						});

						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
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
				destroy: unsub,
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
			const unsubPortal = effect([portal], ([$portal]) => {
				if ($portal === null) return noop;
				const portalDestination = getPortalDestination(node, $portal);
				if (portalDestination === null) return noop;
				const portalAction = usePortal(node, portalDestination);
				if (portalAction && portalAction.destroy) {
					return portalAction.destroy;
				}
				return noop;
			});

			return {
				destroy: unsubPortal,
			};
		},
	});

	const arrow = makeElement(name('arrow'), {
		stores: arrowSize,
		returned: ($arrowSize) => ({
			'data-arrow': true,
			style: styleToString({
				position: 'absolute',
				width: `var(--arrow-size, ${$arrowSize}px)`,
				height: `var(--arrow-size, ${$arrowSize}px)`,
			}),
		}),
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
