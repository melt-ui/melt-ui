import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	noop,
	sleep,
	styleToString,
} from '$lib/internal/helpers';

import { usePopper } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { readable, writable, type Updater } from 'svelte/store';
import type { ChangeFn, CreatePopoverArgs } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
} satisfies Defaults<CreatePopoverArgs>;

type PopoverParts = 'trigger' | 'content' | 'arrow' | 'close';
const { name } = createElHelpers<PopoverParts>('popover');

const overridable = <T>(initialValue: T, onChange?: ChangeFn<T>) => {
	const store = writable(initialValue);

	const update = (updater: Updater<T>, sideEffect?: (newValue: T) => void) => {
		store.update((prev) => {
			const next = updater(prev);
			let res: T = next;
			if (onChange) {
				res = onChange({ prev, next });
			}

			sideEffect?.(res);
			return res;
		});
	};

	const set: typeof store.set = (next) => {
		update(() => next);
	};

	return {
		...store,
		update,
		set,
	};
};

export function createPopover(args?: CreatePopoverArgs) {
	const options = { ...defaults, ...args };
	const positioning = readable(options.positioning);
	const arrowSize = readable(options.arrowSize);
	const open = overridable(options.open, args?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
	};

	const content = builder(name('content'), {
		stores: open,
		returned: ($open) => {
			return {
				'data-state': $open ? 'open' : 'closed',
				hidden: $open ? undefined : true,
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
				[open, activeTrigger, positioning],
				([$open, $activeTrigger, $positioning]) => {
					unsubPopper();
					if ($open && $activeTrigger) {
						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $activeTrigger,
								open,
								options: {
									floating: $positioning,
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
