import {
	addMeltEventListener,
	builder,
	createElHelpers,
	derivedVisible,
	effect,
	getPortalDestination,
	handleFocus,
	isBrowser,
	isHTMLElement,
	kbd,
	noop,
	omit,
	overridable,
	removeScroll,
	styleToString,
	toWritableStores,
	executeCallbacks,
} from '$lib/internal/helpers/index.js';

import { usePopper } from '$lib/internal/actions/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { onMount, tick } from 'svelte';
import { get, writable } from 'svelte/store';
import type { PopoverEvents } from './events.js';
import type { CreatePopoverProps } from './types.js';
import { generateIds } from '../../internal/helpers/id';

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
} satisfies Defaults<CreatePopoverProps>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close';
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
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });

	onMount(() => {
		activeTrigger.set(document.getElementById(get(ids.trigger)));
	});

	function handleClose() {
		open.set(false);
		const triggerEl = document.getElementById(get(ids.trigger));
		handleFocus({ prop: get(closeFocus), defaultEl: triggerEl });
	}

	const isVisible = derivedVisible({ open, activeTrigger, forceVisible });

	const content = builder(name('content'), {
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
				'data-portal': $portal ? '' : undefined,
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
							clickOutside: $closeOnOutsideClick
								? {
										handler: () => {
											handleClose();
										},
								  }
								: null,
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

	const trigger = builder(name('trigger'), {
		stores: [open, ids.content, ids.trigger],
		returned: ([$open, $contentId, $triggerId]) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
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

	const arrow = builder(name('arrow'), {
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

	const close = builder(name('close'), {
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
					const triggerEl = document.getElementById(get(ids.trigger));
					if (!isHTMLElement(triggerEl)) return;
					activeTrigger.set(triggerEl);
				});
			}

			if ($preventScroll) {
				unsubs.push(removeScroll());
			}

			const triggerEl = $activeTrigger ?? document.getElementById(get(ids.trigger));
			handleFocus({ prop: get(openFocus), defaultEl: triggerEl });
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
		},
		states: {
			open,
		},
		options,
	};
}
