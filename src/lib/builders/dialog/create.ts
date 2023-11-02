import {
	createFocusTrap,
	useClickOutside,
	useEscapeKeydown,
	usePortal,
} from '$lib/internal/actions/index.js';
import {
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateIds,
	getPortalDestination,
	handleFocus,
	isBrowser,
	isHTMLElement,
	kbd,
	last,
	noop,
	overridable,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { DialogEvents } from './events.js';
import type { CreateDialogProps } from './types.js';

type DialogParts =
	| 'trigger'
	| 'overlay'
	| 'content'
	| 'title'
	| 'description'
	| 'close'
	| 'portalled';
const { name } = createElHelpers<DialogParts>('dialog');

const defaults = {
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	role: 'dialog',
	defaultOpen: false,
	portal: 'body',
	forceVisible: false,
	openFocus: undefined,
	closeFocus: undefined,
} satisfies Defaults<CreateDialogProps>;

const openDialogIds = writable<string[]>([]);

export function createDialog(props?: CreateDialogProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDialogProps;

	const options = toWritableStores(withDefaults);
	const {
		preventScroll,
		closeOnEscape,
		closeOnOutsideClick,
		role,
		portal,
		forceVisible,
		openFocus,
		closeFocus,
	} = options;

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = generateIds('content', 'title', 'description');

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
		return $open || $forceVisible;
	});

	function handleOpen(e: Event) {
		const el = e.currentTarget;
		const triggerEl = e.currentTarget;
		if (!isHTMLElement(el) || !isHTMLElement(triggerEl)) return;
		open.set(true);
		activeTrigger.set(triggerEl);
	}

	function handleClose() {
		open.set(false);

		handleFocus({
			prop: get(closeFocus),
			defaultEl: get(activeTrigger),
		});
	}

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
		action: (node: HTMLElement): MeltActionReturn<DialogEvents['trigger']> => {
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
			let unsubEscapeKeydown = noop;

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
					unsubEscapeKeydown();
				},
			};
		},
	});

	const content = builder(name('content'), {
		stores: [isVisible],
		returned: ([$isVisible]) => {
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
			};
		},

		action: (node: HTMLElement) => {
			let activate = noop;
			let deactivate = noop;

			const destroy = executeCallbacks(
				effect([open], ([$open]) => {
					if (!$open) return;

					const focusTrap = createFocusTrap({
						immediate: false,
						escapeDeactivates: false,
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
				}),

				effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
					return useClickOutside(node, {
						enabled: $open,
						handler: (e: PointerEvent) => {
							if (e.defaultPrevented) return;

							const $openDialogIds = get(openDialogIds);
							const isLast = last($openDialogIds) === ids.content;
							if ($closeOnOutsideClick && isLast) {
								handleClose();
							}
						},
					}).destroy;
				}),
				effect([closeOnEscape], ([$closeOnEscape]) => {
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
				}),
				effect([isVisible], ([$isVisible]) => {
					tick().then(() => {
						if (!$isVisible) {
							deactivate();
						} else {
							activate();
						}
					});
				})
			);

			return {
				destroy,
			};
		},
	});

	const portalled = builder(name('portalled'), {
		stores: portal,
		returned: ($portal) => ({
			'data-portal': $portal ? '' : undefined,
		}),
		action: (node: HTMLElement) => {
			const unsubPortal = effect([portal], ([$portal]) => {
				if (!$portal) return noop;
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
					unsubPortal();
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

	const close = builder(name('close'), {
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement): MeltActionReturn<DialogEvents['close']> => {
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

		if ($open) {
			const contentEl = document.getElementById(ids.content);
			handleFocus({ prop: get(openFocus), defaultEl: contentEl });
		}

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	return {
		ids,
		elements: {
			content,
			trigger,
			title,
			description,
			overlay,
			close,
			portalled,
		},
		states: {
			open,
		},
		options,
	};
}
