import { createFocusTrap, useEscapeKeydown, usePortal } from '$lib/internal/actions';
import {
	builder,
	createElHelpers,
	effect,
	generateId,
	getPortalParent,
	isBrowser,
	isHTMLElement,
	isLeftClick,
	last,
	noop,
	overridable,
	sleep,
	styleToString,
	toWritableStores,
	addMeltEventListener,
	removeScroll,
	derivedVisible,
	kbd,
	executeCallbacks,
} from '$lib/internal/helpers';
import type { Defaults, MeltActionReturn } from '$lib/internal/types';
import { get, writable, readonly } from 'svelte/store';
import type { CreateDialogProps } from './types';
import { onMount, tick } from 'svelte';

type DialogParts = 'trigger' | 'overlay' | 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<DialogParts>('dialog');

const defaults = {
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	role: 'dialog',
	defaultOpen: false,
	portal: 'body',
	forceVisible: false,
} satisfies Defaults<CreateDialogProps>;

const openDialogIds = writable<string[]>([]);

export function createDialog(props?: CreateDialogProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDialogProps;

	const options = toWritableStores(withDefaults);
	const { preventScroll, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible } = options;

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
		title: generateId(),
		description: generateId(),
		trigger: generateId(),
	};

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	function handleOpen(e: Event) {
		const el = e.currentTarget;
		const triggerEl = e.currentTarget;
		if (!isHTMLElement(el) || !isHTMLElement(triggerEl)) return;
		open.set(true);
		activeTrigger.set(triggerEl);
	}

	function handleClose() {
		open.set(false);
		const triggerEl = document.getElementById(ids.trigger);
		if (triggerEl) {
			tick().then(() => {
				triggerEl.focus();
			});
		}
	}

	onMount(() => {
		activeTrigger.set(document.getElementById(ids.trigger));
	});

	effect([open], ([$open]) => {
		// Prevent double clicks from closing multiple dialogs
		sleep(100).then(() => {
			if ($open) {
				openDialogIds.update((prev) => {
					prev.push(ids.content);
					return prev;
				});
			} else {
				openDialogIds.update((prev) => prev.filter((id) => id !== ids.content));
			}
		});
	});

	type TriggerEvents = 'click' | 'keydown';

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				id: ids.trigger,
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'aria-controls': ids.content,
				type: 'button',
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<TriggerEvents> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					handleOpen(e);
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					handleOpen(e);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const overlay = builder(name('overlay'), {
		stores: [isVisible],
		returned: ([$isVisible]) => {
			return {
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				'aria-hidden': true,
				'data-state': $isVisible ? 'open' : 'closed',
			} as const;
		},
		action: (node: HTMLElement) => {
			let unsubPortal = noop;
			let unsubEscapeKeydown = noop;

			const portal = usePortal(node);
			if (portal && portal.destroy) {
				unsubPortal = portal.destroy;
			}
			if (get(closeOnEscape)) {
				const escapeKeydown = useEscapeKeydown(node, {
					handler: () => {
						handleClose();
					},
				});
				if (escapeKeydown && escapeKeydown.destroy) {
					unsubEscapeKeydown = escapeKeydown.destroy;
				}
			}

			return {
				destroy() {
					unsubPortal();
					unsubEscapeKeydown();
				},
			};
		},
	});

	const content = builder(name('content'), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			return {
				id: ids.content,
				role: get(role),
				'aria-describedby': ids.description,
				'aria-labelledby': ids.title,
				'data-state': $isVisible ? 'open' : 'closed',
				tabindex: -1,
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				'data-portal': $portal ? '' : undefined,
			};
		},

		action: (node: HTMLElement) => {
			const portalParent = getPortalParent(node);
			let activate = noop;
			let deactivate = noop;

			const unsubFocusTrap = effect([closeOnOutsideClick], ([$closeOnOutsideClick]) => {
				const focusTrap = createFocusTrap({
					immediate: false,
					escapeDeactivates: false,
					allowOutsideClick: (e) => {
						e.preventDefault();
						e.stopImmediatePropagation();

						if (e instanceof MouseEvent && !isLeftClick(e)) {
							return false;
						}

						const $openDialogIds = get(openDialogIds);
						const isLast = last($openDialogIds) === ids.content;

						if ($closeOnOutsideClick && isLast) {
							handleClose();
						}

						return false;
					},
					returnFocusOnDeactivate: false,
					fallbackFocus: node,
				});
				activate = focusTrap.activate;
				deactivate = focusTrap.deactivate;
				const ac = focusTrap.useFocusTrap(node);
				if (ac && ac.destroy) {
					return ac.destroy;
				} else {
					return focusTrap.deactivate;
				}
			});

			const unsubPortal = effect([portal], ([$portal]) => {
				if (!$portal) return noop;
				const portalAction = usePortal(node, portalParent === $portal ? portalParent : $portal);
				if (portalAction && portalAction.destroy) {
					return portalAction.destroy;
				} else {
					return noop;
				}
			});

			const unsubEscapeKeydown = effect([closeOnEscape], ([$closeOnEscape]) => {
				if (!$closeOnEscape) return noop;

				const escapeKeydown = useEscapeKeydown(node, {
					handler: () => {
						handleClose();
					},
				});
				if (escapeKeydown && escapeKeydown.destroy) {
					return escapeKeydown.destroy;
				}
				return noop;
			});

			effect([isVisible], ([$isVisible]) => {
				tick().then(() => {
					if (!$isVisible) {
						deactivate();
					} else {
						activate();
					}
				});
			});

			return {
				destroy() {
					unsubPortal();
					unsubEscapeKeydown();
					unsubFocusTrap();
				},
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

	type CloseEvents = 'click' | 'keydown';

	const close = builder(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement): MeltActionReturn<CloseEvents> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					handleClose();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.SPACE && e.key !== kbd.ENTER) return;
					e.preventDefault();
					handleClose();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	effect([open, preventScroll], ([$open, $preventScroll]) => {
		if (!isBrowser) return;
		const unsubs: Array<() => void> = [];

		if ($preventScroll && $open) unsubs.push(removeScroll());

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
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
			open: readonly(open),
		},
		options,
	};
}
