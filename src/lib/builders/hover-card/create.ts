import { usePopper, usePortal } from '$lib/internal/actions';
import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getTabbableNodes,
	isBrowser,
	isHTMLElement,
	isTouch,
	noop,
	sleep,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { CreateHoverCardProps } from './types';

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
} satisfies Defaults<CreateHoverCardProps>;

export function createHoverCard(props: CreateHoverCardProps = {}) {
	const propsWithDefaults = { ...defaults, ...props } satisfies CreateHoverCardProps;
	const open = writable(propsWithDefaults.defaultOpen);
	const hasSelection = writable(false);
	const isPointerDownOnContent = writable(false);
	const containSelection = writable(false);

	// options
	const openDelay = writable(propsWithDefaults.openDelay);
	const closeDelay = writable(propsWithDefaults.closeDelay);
	const positioning = writable<FloatingConfig>(propsWithDefaults.positioning);
	const arrowSize = writable<number>(propsWithDefaults.arrowSize);
	const closeOnOutsideClick = writable<boolean>(propsWithDefaults.closeOnOutsideClick);

	const options = {
		openDelay,
		closeDelay,
		positioning,
		arrowSize,
		closeOnOutsideClick,
	};

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
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
				}),
				addEventListener(node, 'focus', () => get(handleOpen)()),

				addEventListener(node, 'blur', () => get(handleClose)()),
				addEventListener(node, 'touchstart', (e) => {
					// prevent focus on touch devices
					e.preventDefault();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const content = builder(name('content'), {
		stores: [open],
		returned: ([$open]) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
					userSelect: 'text',
					WebkitUserSelect: 'text',
				}),
				id: ids.content,
				'data-state': $open ? 'open' : 'closed',
			};
		},
		action: (node: HTMLElement) => {
			let unsub = noop;

			const unsubTimers = () => {
				if (timeout) {
					window.clearTimeout(timeout);
				}
			};

			const portalReturn = usePortal(node);

			let unsubPopper = noop;
			const unsubOpen = open.subscribe(($open) => {
				if ($open) {
					tick().then(() => {
						const triggerEl = document.getElementById(ids.trigger);
						if (!triggerEl || node.hidden) return;
						const $positioning = get(positioning);
						const $closeOnOutsideClick = get(closeOnOutsideClick);

						const popper = usePopper(node, {
							anchorElement: triggerEl,
							open,
							options: {
								floating: $positioning,
								focusTrap: null,
								clickOutside: !$closeOnOutsideClick ? null : undefined,
							},
						});
						if (popper && popper.destroy) {
							unsubPopper = popper.destroy;
						}
					});
				} else {
					unsubPopper();
				}
			});

			unsub = executeCallbacks(
				addEventListener(node, 'pointerdown', (e) => {
					const currentTarget = e.currentTarget;
					if (!isHTMLElement(currentTarget)) return;
					const target = e.target;
					if (!isHTMLElement(target)) return;

					if (currentTarget.contains(target)) {
						containSelection.set(true);
					}

					hasSelection.set(false);
					isPointerDownOnContent.set(true);
				}),
				addEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
				}),
				addEventListener(node, 'focusout', (e) => {
					e.preventDefault();
				}),

				portalReturn && portalReturn.destroy ? portalReturn.destroy : noop,
				unsubOpen
			);

			return {
				destroy() {
					unsub();
					unsubPopper();
					unsubTimers();
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
		if (!isBrowser) return;
		if ($containSelection) {
			const body = document.body;
			const contentElement = document.getElementById(ids.content);
			if (!isHTMLElement(contentElement)) return;
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
		}
	});

	effect([open], ([$open]) => {
		if (!isBrowser) return;
		if ($open) {
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
			if (!isHTMLElement(contentElement)) return;
			const tabbables = getTabbableNodes(contentElement);
			tabbables.forEach((tabbable) => tabbable.setAttribute('tabindex', '-1'));

			return () => {
				document.removeEventListener('pointerup', handlePointerUp);
				hasSelection.set(false);
				isPointerDownOnContent.set(false);
			};
		}
	});

	return {
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
