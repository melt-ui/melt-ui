import { createFocusTrap, usePortal } from '$lib/internal/actions';
import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	generateId,
	isBrowser,
	isHTMLElement,
	isLeftClick,
	last,
	noop,
	overridable,
	sleep,
	styleToString,
	toWritableStores,
	type MeltEventHandler,
	addMeltEventListener,
} from '$lib/internal/helpers';
import { removeScroll } from '$lib/internal/helpers/scroll';
import type { Defaults } from '$lib/internal/types';
import { get, writable } from 'svelte/store';
import type { CreateDialogProps } from './types';
import type { ActionReturn } from 'svelte/action';

type DialogParts = 'trigger' | 'overlay' | 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<DialogParts>('dialog');

const defaults = {
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	role: 'dialog',
	defaultOpen: false,
} satisfies Defaults<CreateDialogProps>;

const openDialogIds = writable<string[]>([]);

export function createDialog(props: CreateDialogProps = {}) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDialogProps;

	const options = toWritableStores(withDefaults);
	const { preventScroll, closeOnEscape, closeOnOutsideClick, role } = options;

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
		title: generateId(),
		description: generateId(),
	};

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	effect([open], ([$open]) => {
		// Prevent double clicks from closing multiple dialogs
		sleep(100).then(() => {
			if ($open) {
				openDialogIds.update((prev) => [...prev, ids.content]);
			} else {
				openDialogIds.update((prev) => prev.filter((id) => id !== ids.content));
			}
		});
	});

	type TriggerEvents = {
		'on:m-click'?: MeltEventHandler<MouseEvent>;
	};
	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'aria-controls': ids.content,
				type: 'button',
			} as const;
		},
		action: (node: HTMLElement): ActionReturn<unknown, TriggerEvents> => {
			const unsub = addMeltEventListener(node, 'click', (e) => {
				const el = e.currentTarget;
				if (!isHTMLElement(el)) return;
				open.set(true);
				activeTrigger.set(el);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const overlay = builder(name('overlay'), {
		stores: [open],
		returned: ([$open]) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				'aria-hidden': true,
				'data-state': $open ? 'open' : 'closed',
			} as const;
		},
	});

	const content = builder(name('content'), {
		stores: [open, role],
		returned: ([$open, $role]) => {
			return {
				id: ids.content,
				role: $role,
				'aria-describedby': ids.description,
				'aria-labelledby': ids.title,
				'data-state': $open ? 'open' : 'closed',
				tabindex: -1,
				hidden: $open ? undefined : true,
			};
		},

		action: (node: HTMLElement) => {
			let unsub = noop;

			const { useFocusTrap, activate, deactivate } = createFocusTrap({
				immediate: false,
				escapeDeactivates: false,
				allowOutsideClick: (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();

					if (e instanceof MouseEvent && !isLeftClick(e)) {
						return false;
					}

					const $closeOnOutsideClick = get(closeOnOutsideClick);
					const $openDialogIds = get(openDialogIds);
					const isLast = last($openDialogIds) === ids.content;

					if ($closeOnOutsideClick && isLast) {
						open.set(false);
					}

					return false;
				},
				returnFocusOnDeactivate: false,
				fallbackFocus: node,
			});
			const ac = useFocusTrap(node);
			if (ac && ac.destroy) {
				unsub = ac.destroy;
			} else {
				unsub = deactivate;
			}

			effect([open], ([$open]) => {
				if (node.hidden || !$open) {
					deactivate();
				} else {
					activate();
				}
			});

			return {
				destroy: unsub,
			};
		},
	});

	const title = builder(name('title'), {
		returned: () => ({
			id: ids.title,
		}),
	});

	const description = builder(name('description'), {
		returned: () => ({
			id: ids.description,
		}),
	});

	type CloseEvents = {
		'on:m-click': MeltEventHandler<MouseEvent>;
	};

	const close = builder(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement): ActionReturn<unknown, CloseEvents> => {
			const unsub = addMeltEventListener(node, 'click', () => {
				open.set(false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	effect(
		[open, openDialogIds, closeOnEscape, preventScroll],
		([$open, $openDialogIds, $closeOnEscape, $preventScroll]) => {
			const unsubs: Array<() => void> = [];

			const isLast = last($openDialogIds) === ids.content;

			if ($closeOnEscape && $open && isLast) {
				unsubs.push(
					addEventListener(document, 'keydown', (e) => {
						if (e.key === 'Escape') {
							open.set(false);
						}
					})
				);
			}

			if ($preventScroll && $open) unsubs.push(removeScroll());

			return () => {
				unsubs.forEach((unsub) => unsub());
			};
		}
	);

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return {
		elements: {
			content,
			trigger,
			title,
			description,
			overlay,
			close,
		},
		states: {
			open,
		},
		actions: {
			portal: usePortal,
		},
		options,
	};
}
