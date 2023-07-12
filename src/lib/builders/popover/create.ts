import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	noop,
	omit,
	sleep,
	styleToString,
} from '$lib/internal/helpers';

import { usePopper } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { overridable } from '$lib/internal/helpers';
import { tick } from 'svelte';
import { get, readable, writable } from 'svelte/store';
import type { CreatePopoverProps } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	defaultOpen: false,
} satisfies Defaults<CreatePopoverProps>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close';
const { name } = createElHelpers<PopoverParts>('popover');

export function createPopover(args?: CreatePopoverProps) {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'open', 'onOpenChange', 'defaultOpen'));

	const positioning = readable(withDefaults.positioning);
	const arrowSize = readable(withDefaults.arrowSize);

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
	};

	const content = builder(name('content'), {
		stores: open,
		returned: ($open) => {
			return {
				'data-state': $open ? 'open' : 'closed',
				hidden: $open && isBrowser ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.content,
			};
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[open, activeTrigger, positioning, options],
				([$open, $activeTrigger, $positioning, $options]) => {
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: $positioning,
									focusTrap: $options.disableFocusTrap ? null : undefined,
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
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

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				role: 'button',
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
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

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return { trigger, open, content, arrow, close, options };
}
