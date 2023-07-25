import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	noop,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
	omit,
	overridable,
	isHTMLElement,
	getPortalParent,
} from '$lib/internal/helpers';

import { usePopper } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
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
	portal: true,
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
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	const show = derived([open, activeTrigger], ([$open, $activeTrigger]) => {
		return $open && $activeTrigger !== null;
	});

	const content = builder(name('content'), {
		stores: [show, portal],
		returned: ([$show, $portal]) => {
			return {
				hidden: $show && isBrowser ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $show ? undefined : 'none',
				}),
				id: ids.content,
				'data-state': $show ? 'open' : 'closed',
				'data-portal': $portal ? '' : '',
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
					open,
					activeTrigger,
					positioning,
					disableFocusTrap,
					closeOnEscape,
					closeOnOutsideClick,
					portal,
				],
				([
					$open,
					$activeTrigger,
					$positioning,
					$disableFocusTrap,
					$closeOnEscape,
					$closeOnOutsideClick,
					$portal,
				]) => {
					unsubPopper();
					if (!($open && $activeTrigger)) return;
					tick().then(() => {
						const popper = usePopper(node, {
							anchorElement: $activeTrigger,
							open,
							options: {
								floating: $positioning,
								focusTrap: $disableFocusTrap ? null : undefined,
								clickOutside: $closeOnOutsideClick ? undefined : null,
								escapeKeydown: $closeOnEscape ? undefined : null,
								portal: $portal ? portalParent : null,
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
		action: (node: HTMLElement) => {
			const $activeTrigger = get(activeTrigger);

			if (withDefaults.defaultOpen && $activeTrigger === null) {
				activeTrigger.set(node);
			}

			const unsub = addEventListener(node, 'click', () => {
				open.update(
					(prev) => !prev,
					(isOpen) => {
						if (isOpen) {
							activeTrigger.set(node);
						} else {
							activeTrigger.set(null);
						}
					}
				);
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
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.set(false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	effect([open], ([$open]) => {
		if (!isBrowser) return;

		const unsubs: Array<() => void> = [];
		const $activeTrigger = get(activeTrigger);

		if ($open) {
			if (!$activeTrigger) {
				tick().then(() => {
					const triggerEl = document.getElementById(ids.trigger);
					if (!isHTMLElement(triggerEl)) return;
					activeTrigger.set(triggerEl);
				});
			}

			if (get(preventScroll)) {
				unsubs.push(removeScroll());
			}
		}

		if (!$open && $activeTrigger) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
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
