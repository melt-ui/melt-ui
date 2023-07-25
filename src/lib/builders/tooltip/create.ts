import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	makeHullFromElements,
	noop,
	omit,
	pointInPolygon,
	styleToString,
} from '$lib/internal/helpers';

import { useFloating, usePortal } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store';
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

export function createTooltip(props?: CreateTooltipProps) {
	const withDefaults = { ...defaults, ...props } as CreateTooltipProps;
	const options = writable(omit(withDefaults, 'open'));

	const open = writable(withDefaults.open);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	let clickedTrigger = false;

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

	const closeTooltip = (isBlur?: boolean) => {
		const $options = get(options);

		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		if (isBlur && isMouseInTooltipArea) return;

		timeout = window.setTimeout(() => {
			open.set(false);
			if (isBlur) clickedTrigger = false;
		}, $options.closeDelay);
	};

	const trigger = builder(name('trigger'), {
		returned: () => {
			return {
				'aria-describedby': ids.content,
				id: ids.trigger,
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'pointerdown', () => {
					const $options = get(options);
					if (!$options.closeOnPointerDown) return;
					open.set(false);
					clickedTrigger = true;
					if (timeout) {
						window.clearTimeout(timeout);
						timeout = null;
					}
				}),
				addEventListener(node, 'pointerenter', (e) => {
					if (e.pointerType === 'touch') return;
					openTooltip();
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (e.pointerType === 'touch') return;
					if (timeout) {
						window.clearTimeout(timeout);
						timeout = null;
					}
				}),
				addEventListener(node, 'focus', () => {
					if (clickedTrigger) return;
					openTooltip();
				}),
				addEventListener(node, 'blur', () => closeTooltip(true)),
				addEventListener(node, 'keydown', (e) => {
					if (e.key === 'Escape') {
						if (timeout) {
							window.clearTimeout(timeout);
							timeout = null;
						}

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
				addEventListener(node, 'pointerenter', openTooltip),
				addEventListener(node, 'pointerdown', openTooltip),
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

	let isMouseInTooltipArea = false;

	effect(open, ($open) => {
		if ($open) {
			return executeCallbacks(
				addEventListener(document, 'mousemove', (e) => {
					const triggerEl = document.getElementById(ids.trigger);
					if (!triggerEl) return;

					const contentEl = document.getElementById(ids.content);
					if (!contentEl) return;

					const polygon = makeHullFromElements([triggerEl, contentEl]);

					isMouseInTooltipArea = pointInPolygon(
						{
							x: e.clientX,
							y: e.clientY,
						},
						polygon
					);

					if (isMouseInTooltipArea || (document.activeElement === triggerEl && !clickedTrigger)) {
						openTooltip();
					} else {
						closeTooltip();
					}
				})
			);
		}
	});

	return { trigger, open, content, arrow, options };
}
