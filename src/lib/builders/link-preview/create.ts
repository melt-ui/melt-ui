import { usePopper } from '$lib/internal/actions/index.js';
import {
	addMeltEventListener,
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
	makeElement,
	noop,
	sleep,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import { safeOnMount } from '$lib/internal/helpers/lifecycle.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import { withGet, type WithGet } from '$lib/internal/helpers/withGet.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { writable, type Readable } from 'svelte/store';
import { generateIds } from '../../internal/helpers/id.js';
import { omit } from '../../internal/helpers/object.js';
import type { LinkPreviewEvents } from './events.js';
import type { CreateLinkPreviewProps } from './types.js';

type LinkPreviewParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<LinkPreviewParts>('hover-card');

const defaults = {
	open: false,
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
	const { open, ...options } = parseProps(omit(props ?? {}, 'ids'), defaults);

	const hasSelection = withGet.writable(false);
	const isPointerDownOnContent = withGet.writable(false);
	const containSelection = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);

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

	const ids = toWritableStores({ ...generateIds(linkPreviewIdParts), ...props.ids });
	let timeout: number | null = null;
	let originalBodyUserSelect: string;

	const handleOpen = withGet.derived(openDelay, ($openDelay) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(true);
			}, $openDelay);
		};
	}) as WithGet<Readable<() => void>>;

	const handleClose = withGet.derived(
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
	) as WithGet<Readable<() => void>>;

	const trigger = makeElement(name('trigger'), {
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
					handleOpen.get()();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					handleClose.get()();
				}),
				addMeltEventListener(node, 'focus', (e) => {
					if (!isElement(e.currentTarget) || !isFocusVisible(e.currentTarget)) return;
					handleOpen.get()();
				}),
				addMeltEventListener(node, 'blur', () => handleClose.get()())
			);

			return {
				destroy: unsub,
			};
		},
	});

	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	const content = makeElement(name('content'), {
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
											onOutsideClick.get()?.(e);
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
					handleOpen.get()();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					handleClose.get()();
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

	const arrow = makeElement(name('arrow'), {
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
		const contentElement = document.getElementById(ids.content.get());
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
		const triggerEl = document.getElementById(ids.trigger.get());
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

		const contentElement = document.getElementById(ids.content.get());
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
