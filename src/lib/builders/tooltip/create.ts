import {
	addEventListener,
	builder,
	createElHelpers,
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
import type { CreateTooltipProps } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	open: false,
	closeOnPointerDown: true,
	openDelay: 1000,
	closeDelay: 0,
} satisfies Defaults<CreateTooltipProps>;

type TooltipParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<TooltipParts>('tooltip');

// TODO: Add grace area to prevent tooltip from closing when moving from trigger to tooltip

export function createTooltip(props?: CreateTooltipProps) {
	const withDefaults = { ...defaults, ...props } as CreateTooltipProps;
	const options = writable(omit(withDefaults, 'open'));

	const open = writable(withDefaults.open);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	const openTooltip = () => {
		const $options = get(options);

		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		timeout = window.setTimeout(() => {
			open.set(true);
		}, $options.openDelay);
	};

	const closeTooltip = () => {
		const $options = get(options);

		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		timeout = window.setTimeout(() => {
			open.set(false);
		}, $options.closeDelay);
	};

	const trigger = builder(name('trigger'), {
		returned: () => {
			return {
				'aria-describedby': ids.content,
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'mouseover', openTooltip),
				addEventListener(node, 'mouseout', closeTooltip),
				addEventListener(node, 'focus', openTooltip),
				addEventListener(node, 'blur', closeTooltip),
				addEventListener(node, 'keydown', (e) => {
					if (e.key === 'Escape') closeTooltip();
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
				role: 'tooltip',
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
						const triggerEl = document.querySelector(`[aria-describedby="${ids.content}"]`);
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
				addEventListener(node, 'mouseover', openTooltip),
				addEventListener(node, 'mouseout', closeTooltip),
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
		stores: options,
		returned: ($options) => ({
			'data-arrow': true,
			style: styleToString({
				position: 'absolute',
				width: `var(--arrow-size, ${$options.arrowSize}px)`,
				height: `var(--arrow-size, ${$options.arrowSize}px)`,
			}),
		}),
	});

	return { trigger, open, content, arrow, options };
}
