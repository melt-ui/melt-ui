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
	overridable,
	pointInPolygon,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';

import { useFloating, usePortal } from '$lib/internal/actions';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { CreateTooltipProps } from './types';

const defaults = {
	positioning: {
		placement: 'bottom',
	},
	arrowSize: 8,
	defaultOpen: false,
	closeOnPointerDown: true,
	openDelay: 1000,
	closeDelay: 0,
	forceVisible: false,
} satisfies Defaults<CreateTooltipProps>;

type TooltipParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<TooltipParts>('tooltip');

export function createTooltip(props?: CreateTooltipProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateTooltipProps;

	const options = toWritableStores(omit(withDefaults, 'open'));
	const { positioning, arrowSize, closeOnPointerDown, openDelay, closeDelay, forceVisible } =
		options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	let clickedTrigger = false;

	const openTooltip = () => {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		timeout = window.setTimeout(() => {
			open.set(true);
		}, get(openDelay));
	};

	const closeTooltip = (isBlur?: boolean) => {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		if (isBlur && isMouseInTooltipArea) return;

		timeout = window.setTimeout(() => {
			open.set(false);
			if (isBlur) clickedTrigger = false;
		}, get(closeDelay));
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
					const $closeOnPointerDown = get(closeOnPointerDown);
					if (!$closeOnPointerDown) return;
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

	const isVisible = derived(
		[open, forceVisible],
		([$open, $forceVisible]) => $open || $forceVisible
	);

	const content = builder(name('content'), {
		stores: isVisible,
		returned: ($isVisible) => {
			return {
				role: 'tooltip',
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
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
						const floatingReturn = useFloating(triggerEl, node, get(positioning));
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
