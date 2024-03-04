import {
	addMeltEventListener,
	createElHelpers,
	defineIdParts,
	derivedVisible,
	effect,
	executeCallbacks,
	getPortalDestination,
	handleFocus,
	isBrowser,
	isElement,
	isHTMLElement,
	kbd,
	makeElement,
	noop,
	portalAttr,
	removeScroll,
	sleep,
	styleToString,
} from '$lib/internal/helpers/index.js';

import {
	useEscapeKeydown,
	usePopper,
	usePortal,
	type InteractOutsideEvent,
} from '$lib/internal/actions/index.js';
import { safeOnMount } from '$lib/internal/helpers/lifecycle.js';
import { parseProps } from '$lib/internal/helpers/props.js';
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
	open: false,
	disableFocusTrap: false,
	closeOnEscape: true,
	preventScroll: false,
	closeOnOutsideClick: true,
	portal: undefined,
	forceVisible: false,
	openFocus: undefined,
	closeFocus: undefined,
	onOutsideClick: undefined,
} satisfies Defaults<CreatePopoverProps>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close' | 'overlay';
const { name } = createElHelpers<PopoverParts>('popover');

export const popoverIdParts = defineIdParts(['trigger', 'content']);
export type PopoverIdParts = typeof popoverIdParts;

export function createPopover(props?: CreatePopoverProps) {
	const { open, ids, ...options } = parseProps({ props, defaults, idParts: popoverIdParts });
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

	const activeTrigger = writable<HTMLElement | null>(null);

	safeOnMount(() => {
		activeTrigger.set(document.getElementById(ids.trigger.get()));
	});

	async function handleClose() {
		await sleep(0);
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
							escapeKeydown: $closeOnEscape
								? {
										handler: () => {
											handleClose();
										},
								  }
								: null,
							portal: getPortalDestination(node, $portal),
						},
					});

					if (popper && popper.destroy) {
						unsubPopper = popper.destroy;
					}
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

	function toggleOpen(triggerEl?: HTMLElement) {
		open.update((prev) => {
			return !prev;
		});
		if (triggerEl) {
			activeTrigger.set(triggerEl);
		}
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
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					toggleOpen(node);
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					toggleOpen(node);
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
			let unsubEscapeKeydown = noop;

			if (closeOnEscape.get()) {
				const escapeKeydown = useEscapeKeydown(node, {
					handler: () => {
						handleClose();
					},
				});
				if (escapeKeydown && escapeKeydown.destroy) {
					unsubEscapeKeydown = escapeKeydown.destroy;
				}
			}

			const unsubPortal = effect([portal], ([$portal]) => {
				if ($portal === null) return noop;
				const portalDestination = getPortalDestination(node, $portal);
				if (portalDestination === null) return noop;
				const portalAction = usePortal(node, portalDestination);
				if (portalAction && portalAction.destroy) {
					return portalAction.destroy;
				} else {
					return noop;
				}
			});

			return {
				destroy() {
					unsubEscapeKeydown();
					unsubPortal();
				},
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
		if (!isBrowser) return;

		const unsubs: Array<() => void> = [];

		if ($open) {
			if (!$activeTrigger) {
				tick().then(() => {
					const triggerEl = document.getElementById(ids.trigger.get());
					if (!isHTMLElement(triggerEl)) return;
					activeTrigger.set(triggerEl);
				});
			}

			if ($preventScroll) {
				unsubs.push(removeScroll());
			}

			const triggerEl = $activeTrigger ?? document.getElementById(ids.trigger.get());
			handleFocus({ prop: openFocus.get(), defaultEl: triggerEl });
		}

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
