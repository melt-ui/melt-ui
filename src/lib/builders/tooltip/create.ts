import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	noop,
	omit,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';

import { useFloating, usePortal } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { CreateTooltipProps } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
	closeOnPointerDown: true,
	openDelay: 1000,
	closeDelay: 500,
} satisfies Defaults<CreateTooltipProps>;

type TooltipParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<TooltipParts>('tooltip');

// TODO: Add grace area to prevent tooltip from closing when moving from trigger to tooltip

export function createTooltip(props?: CreateTooltipProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateTooltipProps;

	const options = toWritableStores(omit(withDefaults, 'open'));
	const { positioning, arrowSize, closeOnPointerDown, openDelay, closeDelay } = options;

	const open = writable(withDefaults.open);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	const openTooltip = derived(openDelay, ($openDelay) => {
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

	const closeTooltip = derived(closeDelay, ($closeDelay) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(false);
			}, $closeDelay);
		};
	}) as Readable<() => void>;

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
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
				addEventListener(node, 'mouseover', () => get(openTooltip)()),
				addEventListener(node, 'mouseout', () => get(closeTooltip)()),
				addEventListener(node, 'focus', () => open.set(true)),
				addEventListener(node, 'blur', () => open.set(false)),
				addEventListener(node, 'mousedown', (e) => {
					e.preventDefault();
					if (get(closeOnPointerDown)) {
						open.set(false);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const content = builder(name('content'), {
		stores: open,
		returned: ($open) => {
			return {
				hidden: $open ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.content,
			};
		},
		action: (node: HTMLElement) => {
			let unsub = noop;

			const portalReturn = usePortal(node);

			let unsubFloating = noop;
			const unsubOpen = open.subscribe(($open) => {
				if ($open) {
					tick().then(() => {
						const triggerEl = document.getElementById(ids.trigger);
						if (!triggerEl || node.hidden) return;
						const floatingReturn = useFloating(triggerEl, node, get(positioning));
						unsubFloating = floatingReturn.destroy;
					});
				} else {
					unsubFloating();
				}
			});

			unsub = executeCallbacks(
				addEventListener(node, 'mouseover', () => get(openTooltip)()),
				addEventListener(node, 'mouseout', () => get(closeTooltip)()),
				portalReturn && portalReturn.destroy ? portalReturn.destroy : noop,
				unsubOpen
			);

			return {
				destroy() {
					unsub();
					unsubFloating();
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

	return {
		elements: {
			trigger,
			content,
			arrow,
		},
		states: { open },
		options,
	};
}
