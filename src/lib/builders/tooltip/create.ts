import {
	addEventListener,
	builder,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	generateId,
	getPortalParent,
	isBrowser,
	kbd,
	makeHullFromElements,
	noop,
	omit,
	overridable,
	pointInPolygon,
	styleToString,
	toWritableStores,
	isTouch,
	addMeltEventListener,
} from '$lib/internal/helpers';

import { useFloating, usePortal } from '$lib/internal/actions';
import { onMount, tick } from 'svelte';
import { get, readonly, writable } from 'svelte/store';
import type { CreateTooltipProps } from './types';
import type { MeltActionReturn } from '$lib/internal/types';
import type { TooltipEvents } from './events';

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
	portal: 'body',
	closeOnEscape: true,
} satisfies CreateTooltipProps;

type TooltipParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<TooltipParts>('tooltip');

export function createTooltip(props?: CreateTooltipProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateTooltipProps;

	const options = toWritableStores(omit(withDefaults, 'open'));
	const {
		positioning,
		arrowSize,
		closeOnPointerDown,
		openDelay,
		closeDelay,
		forceVisible,
		portal,
		closeOnEscape,
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	};

	let timeout: number | null = null;

	let clickedTrigger = false;

	onMount(() => {
		if (!isBrowser) return;
		activeTrigger.set(document.querySelector(`[aria-describedby="${ids.content}"]`));
	});

	function openTooltip() {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		timeout = window.setTimeout(() => {
			open.set(true);
		}, get(openDelay));
	}

	function closeTooltip(isBlur?: boolean) {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}

		if (isBlur && isMouseInTooltipArea) return;

		timeout = window.setTimeout(() => {
			open.set(false);
			if (isBlur) clickedTrigger = false;
		}, get(closeDelay));
	}

	const trigger = builder(name('trigger'), {
		returned: () => {
			return {
				'aria-describedby': ids.content,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TooltipEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', () => {
					const $closeOnPointerDown = get(closeOnPointerDown);
					if (!$closeOnPointerDown) return;
					open.set(false);
					clickedTrigger = true;
					if (timeout) {
						window.clearTimeout(timeout);
						timeout = null;
					}
				}),
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					openTooltip();
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					if (timeout) {
						window.clearTimeout(timeout);
						timeout = null;
					}
				}),
				addMeltEventListener(node, 'focus', () => {
					if (clickedTrigger) return;
					openTooltip();
				}),
				addMeltEventListener(node, 'blur', () => closeTooltip(true)),
				addMeltEventListener(node, 'keydown', (e) => {
					if (get(closeOnEscape) && e.key === kbd.ESCAPE) {
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

	const isVisible = derivedVisible({ open, activeTrigger, forceVisible });

	const content = builder(name('content'), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			return {
				role: 'tooltip',
				hidden: $isVisible ? undefined : true,
				tabindex: -1,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: ids.content,
				'data-portal': $portal ? '' : undefined,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TooltipEvents['content']> => {
			const portalParent = getPortalParent(node);

			let unsubFloating = noop;
			let unsubPortal = noop;

			const unsubDerived = effect(
				[isVisible, activeTrigger, positioning, portal],
				([$isVisible, $activeTrigger, $positioning, $portal]) => {
					if (!$isVisible || !$activeTrigger) {
						unsubPortal();
						unsubFloating();
						return;
					}
					tick().then(() => {
						const floatingReturn = useFloating($activeTrigger, node, $positioning);
						unsubFloating = floatingReturn.destroy;
						if (!$portal) {
							unsubPortal();
							return;
						}
						const portalReturn = usePortal(node, portalParent === $portal ? portalParent : $portal);
						if (portalReturn && portalReturn.destroy) {
							unsubPortal = portalReturn.destroy;
						}
					});
				}
			);

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', openTooltip),
				addMeltEventListener(node, 'pointerdown', openTooltip)
			);

			return {
				destroy() {
					unsubEvents();
					unsubPortal();
					unsubFloating();
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

	let isMouseInTooltipArea = false;

	effect([isVisible, activeTrigger], ([$isVisible, $activeTrigger]) => {
		if (!$isVisible || !$activeTrigger) return;
		return executeCallbacks(
			addEventListener(document, 'mousemove', (e) => {
				const contentEl = document.getElementById(ids.content);
				if (!contentEl) return;

				const polygon = makeHullFromElements([$activeTrigger, contentEl]);

				isMouseInTooltipArea = pointInPolygon(
					{
						x: e.clientX,
						y: e.clientY,
					},
					polygon
				);

				if (
					isMouseInTooltipArea ||
					(document.activeElement === $activeTrigger && !clickedTrigger)
				) {
					openTooltip();
				} else {
					closeTooltip();
				}
			})
		);
	});

	return {
		elements: {
			trigger,
			content,
			arrow,
		},
		states: { open: readonly(open) },
		options,
	};
}
