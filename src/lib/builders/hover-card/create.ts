import { usePopper } from '$lib/internal/actions';
import {
	builder,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	generateId,
	getPortalParent,
	getTabbableNodes,
	isBrowser,
	isHTMLElement,
	isTouch,
	noop,
	overridable,
	sleep,
	styleToString,
	toWritableStores,
	addMeltEventListener,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { derived, get, writable, type Readable, readonly } from 'svelte/store';
import type { CreateHoverCardProps } from './types';
import type { MeltActionReturn } from '$lib/internal/types';
import type { HoverCardEvents } from './events';

type HoverCardParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<HoverCardParts>('hover-card');

const defaults = {
	defaultOpen: false,
	openDelay: 700,
	closeDelay: 300,
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	closeOnOutsideClick: true,
	forceVisible: false,
	portal: 'body',
	closeOnEscape: true,
} satisfies CreateHoverCardProps;

export function createHoverCard(props: CreateHoverCardProps = {}) {
	const withDefaults = { ...defaults, ...props } satisfies CreateHoverCardProps;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);
	const hasSelection = writable(false);
	const isPointerDownOnContent = writable(false);
	const containSelection = writable(false);
	const activeTrigger = writable<HTMLElement | null>(null);

	const options = toWritableStores(withDefaults);

	const {
		openDelay,
		closeDelay,
		positioning,
		arrowSize,
		closeOnOutsideClick,
		forceVisible,
		portal,
		closeOnEscape,
	} = options;

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

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
		stores: [open],
		returned: ([$open]) => {
			return {
				role: 'button' as const,
				'aria-haspopup': 'dialog' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
				id: ids.trigger,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<HoverCardEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
				}),
				addMeltEventListener(node, 'focus', () => get(handleOpen)()),

				addMeltEventListener(node, 'blur', () => get(handleClose)()),
				addMeltEventListener(node, 'touchstart', (e) => {
					// prevent focus on touch devices
					e.preventDefault();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const isVisible = derivedVisible({ open, forceVisible, activeTrigger });

	const content = builder(name('content'), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			return {
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
					userSelect: 'text',
					WebkitUserSelect: 'text',
				}),
				id: ids.content,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': $portal ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<HoverCardEvents['content']> => {
			const portalParent = getPortalParent(node);
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
					tick().then(() => {
						const popper = usePopper(node, {
							anchorElement: $activeTrigger,
							open: open,
							options: {
								floating: $positioning,
								clickOutside: $closeOnOutsideClick ? undefined : null,
								portal: $portal ? (portalParent === $portal ? portalParent : $portal) : null,
								focusTrap: null,
								escapeKeydown: $closeOnEscape ? undefined : null,
							},
						});

						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
					});
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
		const contentElement = document.getElementById(ids.content);
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

	onMount(() => {
		const triggerEl = document.getElementById(ids.trigger);
		if (!triggerEl) return;
		activeTrigger.set(triggerEl);
	});

	effect([open], ([$open]) => {
		if (!isBrowser || !$open) return;

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

		const contentElement = document.getElementById(ids.content);
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
		elements: {
			trigger,
			content,
			arrow,
		},
		states: {
			open: readonly(open),
		},
		options,
	};
}
