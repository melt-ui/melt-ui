import { createFocusTrap, useEscapeKeydown, usePortal } from '$lib/internal/actions/index.js';
import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	effect,
	executeCallbacks,
	generateIds,
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
	portalAttr,
} from '$lib/internal/helpers/index.js';
import { withGet } from '$lib/internal/helpers/withGet.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, writable } from 'svelte/store';
import type { DialogEvents } from './events.js';
import type { CreateDialogProps } from './types.js';
import { useModal } from '$lib/internal/actions/modal/action.js';

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
	portal: undefined,
	forceVisible: false,
	openFocus: undefined,
	closeFocus: undefined,
	onOutsideClick: undefined,
} satisfies Defaults<CreateDialogProps>;

export const dialogIdParts = ['content', 'title', 'description'] as const;
export type DialogIdParts = typeof dialogIdParts;

export function createDialog(props?: CreateDialogProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDialogProps;

	const options = toWritableStores(omit(withDefaults, 'ids'));

	const {
		preventScroll,
		closeOnEscape,
		closeOnOutsideClick,
		role,
		portal,
		forceVisible,
		openFocus,
		closeFocus,
		onOutsideClick,
	} = options;

	const activeTrigger = withGet.writable<HTMLElement | null>(null);

	const ids = toWritableStores({
		...generateIds(dialogIdParts),
		...withDefaults.ids,
	});

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
		return $open || $forceVisible;
	});

	let unsubScroll = noop;

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
			prop: closeFocus.get(),
			defaultEl: activeTrigger.get(),
		});
	}

	const trigger = makeElement(name('trigger'), {
		stores: [open],
		returned: ([$open]) => {
			return {
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
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

	const overlay = makeElement(name('overlay'), {
		stores: [isVisible, open],
		returned: ([$isVisible, $open]) => {
			return {
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				'aria-hidden': true,
				'data-state': $open ? 'open' : 'closed',
			} as const;
		},
	});

	const content = makeElement(name('content'), {
		stores: [isVisible, ids.content, ids.description, ids.title, open],
		returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
			return {
				id: $contentId,
				role: role.get(),
				'aria-describedby': $descriptionId,
				'aria-labelledby': $titleId,
				'aria-modal': $isVisible ? 'true' : undefined,
				'data-state': $open ? 'open' : 'closed',
				tabindex: -1,
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
			} as const;
		},

		action: (node: HTMLElement) => {
			let unsubFocus = noop;
			let unsubEscape = noop;
			let unsubModal = noop;

			const unsubDerived = effect(
				[isVisible, closeOnEscape, closeOnOutsideClick],
				([$isVisible, $closeOnEscape, $closeOnOutsideClick]) => {
					unsubFocus();
					unsubEscape();
					unsubModal();
					if (!$isVisible) return;

					unsubFocus = createFocusTrap({
						immediate: true,
						escapeDeactivates: $closeOnEscape,
						clickOutsideDeactivates: $closeOnOutsideClick,
						returnFocusOnDeactivate: false,
						fallbackFocus: node,
					}).useFocusTrap(node).destroy;

					unsubModal = useModal(node, {
						closeOnInteractOutside: $closeOnOutsideClick,
						onClose() {
							handleClose();
						},
						shouldCloseOnInteractOutside(e) {
							onOutsideClick.get()?.(e);
							if (e.defaultPrevented) return false;
							return true;
						},
					}).destroy;

					unsubEscape = useEscapeKeydown(node, {
						handler: handleClose,
						enabled: $closeOnEscape,
					}).destroy;
				}
			);

			return {
				destroy: () => {
					unsubScroll();
					unsubFocus();
					unsubEscape();
					unsubModal();
					unsubDerived();
				},
			};
		},
	});

	const portalled = makeElement(name('portalled'), {
		stores: [portal, isVisible],
		returned: ([$portal, $isVisible]) =>
			({
				hidden: $isVisible ? undefined : true,
				'data-portal': portalAttr($portal),
				style: $isVisible ? undefined : styleToString({ display: 'none' }),
			} as const),

		action: (node: HTMLElement) => {
			let unsubPortal = noop;

			const unsubDerived = effect([isVisible, portal], ([$isVisible, $portal]) => {
				unsubPortal();
				if (!$isVisible || $portal === null) return;
				const portalDestination = getPortalDestination(node, $portal);
				if (portalDestination === null) return;
				unsubPortal = usePortal(node, portalDestination).destroy;
			});

			return {
				destroy() {
					unsubPortal();
					unsubDerived();
				},
			};
		},
	});

	const title = makeElement(name('title'), {
		stores: [ids.title],
		returned: ([$titleId]) =>
			({
				id: $titleId,
			} as const),
	});

	const description = makeElement(name('description'), {
		stores: [ids.description],
		returned: ([$descriptionId]) =>
			({
				id: $descriptionId,
			} as const),
	});

	const close = makeElement(name('close'), {
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

		if ($preventScroll && $open) unsubScroll = removeScroll();

		if ($open) {
			const contentEl = document.getElementById(ids.content.get());
			handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
		}

		return () => {
			// we only want to remove the scroll lock if the dialog is not forced visible
			// otherwise the scroll removal is handled in the `destroy` of the `content` builder
			if (!forceVisible.get()) {
				unsubScroll();
			}
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
