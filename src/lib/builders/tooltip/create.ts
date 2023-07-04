import {
	addEventListener,
	executeCallbacks,
	generateId,
	noop,
	omit,
	styleToString,
} from '$lib/internal/helpers';

import { useFloating, usePortal } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { CreateTooltipArgs } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
	closeOnPointerDown: true,
	openDelay: 1000,
	closeDelay: 500,
} satisfies Defaults<CreateTooltipArgs>;

// TODO: Add grace area to prevent tooltip from closing when moving from trigger to tooltip

export function createTooltip(args?: CreateTooltipArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTooltipArgs;
	const options = writable(omit(withDefaults, 'open'));

	const open = writable(withDefaults.open);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	const openTooltip = derived(options, ($options) => {
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

	const closeTooltip = derived(options, ($options) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			timeout = window.setTimeout(() => {
				open.set(false);
			}, $options.closeDelay);
		};
	}) as Readable<() => void>;

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
				addEventListener(node, 'mouseover', () => get(openTooltip)()),
				addEventListener(node, 'mouseout', () => get(closeTooltip)()),
				addEventListener(node, 'focus', () => open.set(true)),
				addEventListener(node, 'blur', () => open.set(false)),
				addEventListener(node, 'pointerdown', () => {
					const $options = get(options);
					if ($options.closeOnPointerDown) {
						open.set(false);
					}
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
				}),
				id: ids.content,
			};
		}),
		action: (node: HTMLElement) => {
			let unsub = noop;

			const portalReturn = usePortal(node);

			let unsubFloating = noop;
			const unsubOpen = open.subscribe(($open) => {
				if ($open) {
					tick().then(() => {
						const triggerEl = document.getElementById(ids.trigger);
						if (!triggerEl || node.hidden) return;
						const $options = get(options);
						const floatingReturn = useFloating(triggerEl, node, $options.positioning);
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
	};

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	return { trigger, open, content, arrow, options };
}
