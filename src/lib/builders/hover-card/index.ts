import {
	addEventListener,
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
import { derived, get, writable, type Readable } from 'svelte/store';
import { tick } from 'svelte';
import { usePortal, type FloatingConfig, usePopper } from '$lib/internal/actions';

export type CreateHoverCardArgs = {
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	openDelay?: number;
	closeDelay?: number;
	positioning?: FloatingConfig;
	arrowSize?: number;
};

const defaults = {
	defaultOpen: false,
	onOpenChange: noop,
	openDelay: 700,
	closeDelay: 300,
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
} satisfies Defaults<CreateHoverCardArgs>;

export function createHoverCard(args: CreateHoverCardArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args } satisfies CreateHoverCardArgs;
	const options = writable(argsWithDefaults);
	const open = writable(argsWithDefaults.defaultOpen);
	const hasSelection = writable(false);
	const isPointerDownOnContent = writable(false);
	const containSelection = writable(false);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;
	let originalBodyUserSelect: string;

	const handleOpen = derived(options, ($options) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(true);
			}, $options.openDelay);
		};
	}) as Readable<() => void>;

	const handleClose = derived(
		[options, isPointerDownOnContent, hasSelection],
		([$options, $isPointerDownOnContent, $hasSelection]) => {
			return () => {
				if (timeout) {
					window.clearTimeout(timeout);
					timeout = null;
				}
				if (!$isPointerDownOnContent && !$hasSelection) {
					timeout = window.setTimeout(() => {
						open.set(false);
					}, $options.closeDelay);
				}
			};
		}
	) as Readable<() => void>;

	const trigger = {
		...derived([open], ([$open]) => {
			return {
				role: 'button' as const,
				'aria-haspopup': 'dialog' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
				id: ids.trigger,
			};
		}),
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
	};

	const content = {
		...derived([open], ([$open]) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
					userSelect: 'text',
					WebkitUserSelect: 'text',
				}),
				id: ids.content,
			};
		}),
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
						const $options = get(options);

						const popper = usePopper(node, {
							anchorElement: triggerEl,
							open,
							options: {
								floating: $options.positioning,
								focusTrap: null,
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
	};

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

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

	return { trigger, open, content, arrow, options };
}
