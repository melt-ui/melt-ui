import {
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	noop,
	removeScroll,
	styleToString,
	toWritableStores,
	omit,
	overridable,
	isHTMLElement,
	getPortalParent,
	derivedVisible,
	addMeltEventListener,
} from '$lib/internal/helpers';

import { usePopper } from '$lib/internal/actions';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { onMount, tick } from 'svelte';
import { writable } from 'svelte/store';
import type { CreatePopoverProps } from './types';

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
	portal: 'body',
	forceVisible: false,
} satisfies Defaults<CreatePopoverProps>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close';
const { name } = createElHelpers<PopoverParts>('popover');

export function createPopover(args?: CreatePopoverProps) {
	const withDefaults = { ...defaults, ...args } satisfies CreatePopoverProps;

	const options = toWritableStores(omit(withDefaults, 'open'));
	const {
		positioning,
		arrowSize,
		disableFocusTrap,
		preventScroll,
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		forceVisible,
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	onMount(() => {
		activeTrigger.set(document.getElementById(ids.trigger));
	});

	function handleClose() {
		open.set(false);
		const triggerEl = document.getElementById(ids.trigger);
		if (triggerEl) {
			tick().then(() => {
				triggerEl.focus();
			});
		}
	}

	const isVisible = derivedVisible({ open, activeTrigger, forceVisible });

	const content = builder(name('content'), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			return {
				hidden: $isVisible && isBrowser ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: ids.content,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': $portal ? '' : undefined,
			};
		},
		action: (node: HTMLElement) => {
			/**
			 * We need to get the parent portal before the menu is opened,
			 * otherwise the parent will have been moved to the body, and
			 * will no longer be an ancestor of this node.
			 */
			const portalParent = getPortalParent(node);
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
								focusTrap: $disableFocusTrap ? null : undefined,
								clickOutside: $closeOnOutsideClick
									? {
											handler: (e) => {
												if (!isHTMLElement(e.target)) return;
												if ($activeTrigger.contains(e.target)) return;
												if (e.target === $activeTrigger) return;
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
								portal: $portal ? (portalParent === $portal ? portalParent : $portal) : null,
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

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
				id: ids.trigger,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<'click'> => {
			const unsub = addMeltEventListener(node, 'click', () => {
				open.update((prev) => {
					if (prev) {
						return false;
					}

					return true;
				});
			});

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
		action: (node: HTMLElement): MeltActionReturn<'click'> => {
			const unsub = addMeltEventListener(node, 'click', () => {
				handleClose();
			});

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
					const triggerEl = document.getElementById(ids.trigger);
					if (!isHTMLElement(triggerEl)) return;
					activeTrigger.set(triggerEl);
				});
			}

			if ($preventScroll) {
				unsubs.push(removeScroll());
			}
		}

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});
	return {
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
