import { usePopper } from '$lib/internal/actions/index.js';
import {
	addMeltEventListener,
	builder,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	getPortalDestination,
	getTabbableNodes,
	isBrowser,
	isElement,
	isFocusVisible,
	isHTMLElement,
	isTouch,
	noop,
	overridable,
	sleep,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import { safeOnMount } from '$lib/internal/helpers/lifecycle';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, writable, type Readable } from 'svelte/store';
import { generateIds } from '../../internal/helpers/id';
import { omit } from '../../internal/helpers/object';
import type { LinkPreviewEvents } from './events.js';
import type { CreateLinkPreviewProps } from './types.js';

type LinkPreviewParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<LinkPreviewParts>('hover-card');

const defaults = {
	defaultOpen: false,
	openDelay: 1000,
	closeDelay: 100,
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	closeOnOutsideClick: true,
	forceVisible: false,
	portal: 'body',
	closeOnEscape: true,
	onOutsideClick: undefined,
} satisfies CreateLinkPreviewProps;

export const linkPreviewIdParts = ['trigger', 'content'] as const;
export type LinkPreviewIdParts = typeof linkPreviewIdParts;

export function createLinkPreview(props: CreateLinkPreviewProps = {}) {
	const withDefaults = { ...defaults, ...props } satisfies CreateLinkPreviewProps;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	const hasSelection = writable(false);
	const isPointerDownOnContent = writable(false);
	const containSelection = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);

	// type OpenReason = 'pointer' | 'focus';
	// const openReason = writable<null | OpenReason>(null);

	const options = toWritableStores(omit(withDefaults, 'ids'));

	const {
		openDelay,
		closeDelay,
		positioning,
		arrowSize,
		closeOnOutsideClick,
		forceVisible,
		portal,
		closeOnEscape,
		onOutsideClick,
	} = options;

	const ids = toWritableStores({ ...generateIds(linkPreviewIdParts), ...withDefaults.ids });
	let timeout: number | null = null;
	let originalBodyUserSelect: string;

	const handleOpen = derived(openDelay, ($openDelay) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(true);
			}, $openDelay);
		};
	}) as Readable<() => void>;

	const handleClose = derived(
		[closeDelay, isPointerDownOnContent, hasSelection],
		([$closeDelay, $isPointerDownOnContent, $hasSelection]) => {
			return () => {
				if (timeout) {
					window.clearTimeout(timeout);
					timeout = null;
				}
				if (!$isPointerDownOnContent && !$hasSelection) {
					timeout = window.setTimeout(() => {
						open.set(false);
					}, $closeDelay);
				}
			};
		}
	) as Readable<() => void>;

	const trigger = builder(name('trigger'), {
		stores: [open, ids.trigger, ids.content],
		returned: ([$open, $triggerId, $contentId]) => {
			return {
				role: 'button' as const,
				'aria-haspopup': 'dialog' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': $contentId,
				id: $triggerId,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<LinkPreviewEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
				}),
				addMeltEventListener(node, 'focus', (e) => {
					if (!isElement(e.currentTarget) || !isFocusVisible(e.currentTarget)) return;
					get(handleOpen)();
				}),
				addMeltEventListener(node, 'blur', () => get(handleClose)())
			);

			return {
				destroy: unsub,
			};
		},
	});

	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	const content = builder(name('content'), {
		stores: [isVisible, portal, ids.content],
		returned: ([$isVisible, $portal, $contentId]) => {
			return {
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					'pointer-events': $isVisible ? undefined : 'none',
					opacity: $isVisible ? 1 : 0,
					userSelect: 'text',
					WebkitUserSelect: 'text',
				}),
				id: $contentId,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': $portal ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<LinkPreviewEvents['content']> => {
			let unsub = noop;

			const unsubTimers = () => {
				if (timeout) {
					window.clearTimeout(timeout);
				}
			};

			let unsubPopper = noop;

			const unsubDerived = effect(
				[isVisible, activeTrigger, positioning, closeOnOutsideClick, portal, closeOnEscape],
				([
					$isVisible,
					$activeTrigger,
					$positioning,
					$closeOnOutsideClick,
					$portal,
					$closeOnEscape,
				]) => {
					unsubPopper();
					if (!$isVisible || !$activeTrigger) return;

					const popper = usePopper(node, {
						anchorElement: $activeTrigger,
						open: open,
						options: {
							floating: $positioning,
							clickOutside: $closeOnOutsideClick
								? {
										handler: (e) => {
											get(onOutsideClick)?.(e);
											if (e.defaultPrevented) return;

											if (
												isHTMLElement($activeTrigger) &&
												!$activeTrigger.contains(e.target as Element)
											) {
												open.set(false);
												$activeTrigger.focus();
											}
										},
									}
								: null,
							portal: getPortalDestination(node, $portal),
							focusTrap: null,
							escapeKeydown: $closeOnEscape ? undefined : null,
						},
					});

					if (popper && popper.destroy) {
						unsubPopper = popper.destroy;
					}
				}
			);

			unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', (e) => {
					const currentTarget = e.currentTarget;
					const target = e.target;
					if (!isHTMLElement(currentTarget) || !isHTMLElement(target)) return;

					if (currentTarget.contains(target)) {
						containSelection.set(true);
					}

					hasSelection.set(false);
					isPointerDownOnContent.set(true);
				}),
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
				}),
				addMeltEventListener(node, 'focusout', (e) => {
					e.preventDefault();
				})
			);

			return {
				destroy() {
					unsub();
					unsubPopper();
					unsubTimers();
					unsubDerived();
				},
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

	effect([containSelection], ([$containSelection]) => {
		if (!isBrowser || !$containSelection) return;
		const body = document.body;
		const contentElement = document.getElementById(get(ids.content));
		if (!contentElement) return;
		// prefix for safari
		originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
		const originalContentUserSelect =
			contentElement.style.userSelect || contentElement.style.webkitUserSelect;
		body.style.userSelect = 'none';
		body.style.webkitUserSelect = 'none';

		contentElement.style.userSelect = 'text';
		contentElement.style.webkitUserSelect = 'text';
		return () => {
			body.style.userSelect = originalBodyUserSelect;
			body.style.webkitUserSelect = originalBodyUserSelect;
			contentElement.style.userSelect = originalContentUserSelect;
			contentElement.style.webkitUserSelect = originalContentUserSelect;
		};
	});

	safeOnMount(() => {
		const triggerEl = document.getElementById(get(ids.trigger));
		if (!triggerEl) return;
		activeTrigger.set(triggerEl);
	});

	effect([open], ([$open]) => {
		if (!isBrowser || !$open) {
			hasSelection.set(false);
			return;
		}

		const handlePointerUp = () => {
			containSelection.set(false);
			isPointerDownOnContent.set(false);

			sleep(1).then(() => {
				const isSelection = document.getSelection()?.toString() !== '';
				if (isSelection) {
					hasSelection.set(true);
				}
			});
		};

		document.addEventListener('pointerup', handlePointerUp);

		const contentElement = document.getElementById(get(ids.content));
		if (!contentElement) return;
		const tabbables = getTabbableNodes(contentElement);
		tabbables.forEach((tabbable) => tabbable.setAttribute('tabindex', '-1'));

		return () => {
			document.removeEventListener('pointerup', handlePointerUp);
			hasSelection.set(false);
			isPointerDownOnContent.set(false);
		};
	});

	return {
		ids,
		elements: {
			trigger,
			content,
			arrow,
		},
		states: {
			open,
		},
		options,
	};
}
