import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getPortalDestination,
	isBrowser,
	isTouch,
	kbd,
	makeHullFromElements,
	noop,
	omit,
	overridable,
	pointInPolygon,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';

import { useFloating, usePortal } from '$lib/internal/actions/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { TooltipEvents } from './events.js';
import type { CreateTooltipProps } from './types.js';

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
	disableHoverableContent: false,
	group: undefined,
} satisfies CreateTooltipProps;

type TooltipParts = 'trigger' | 'content' | 'arrow';
const { name } = createElHelpers<TooltipParts>('tooltip');

// Store a global map to get the currently open tooltip.
const groupMap = new Map<string | true, Writable<boolean>>();

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
		disableHoverableContent,
		group,
	} = options;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const open = overridable(openWritable, withDefaults?.onOpenChange);

	type OpenReason = 'pointer' | 'focus';
	const openReason = writable<null | OpenReason>(null);

	const ids = {
		content: generateId(),
		trigger: generateId(),
	} as const;

	let clickedTrigger = false;

	const getEl = (part: keyof typeof ids) => {
		if (!isBrowser) return null;
		return document.getElementById(ids[part]);
	};

	let openTimeout: number | null = null;
	let closeTimeout: number | null = null;

	function openTooltip(reason: OpenReason) {
		if (closeTimeout) {
			window.clearTimeout(closeTimeout);
			closeTimeout = null;
		}

		if (!openTimeout) {
			openTimeout = window.setTimeout(() => {
				open.set(true);
				// Don't override the reason if it's already set.
				openReason.update((prev) => prev ?? reason);
				openTimeout = null;
			}, get(openDelay));
		}
	}

	function closeTooltip(isBlur?: boolean) {
		if (openTimeout) {
			window.clearTimeout(openTimeout);
			openTimeout = null;
		}

		if (isBlur && isMouseInTooltipArea) {
			// Normally when blurring the trigger, we want to close the tooltip.
			// The exception is when the mouse is still in the tooltip area.
			// In that case, we have to set the openReason to pointer, so that
			// it can close when the mouse leaves the tooltip area.
			openReason.set('pointer');
			return;
		}

		if (!closeTimeout) {
			closeTimeout = window.setTimeout(() => {
				open.set(false);
				openReason.set(null);
				if (isBlur) clickedTrigger = false;
				closeTimeout = null;
			}, get(closeDelay));
		}
	}

	const trigger = builder(name('trigger'), {
		returned: () => {
			return {
				'aria-describedby': ids.content,
				id: ids.trigger,
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TooltipEvents['trigger']> => {
			const keydownHandler = (e: KeyboardEvent) => {
				if (get(closeOnEscape) && e.key === kbd.ESCAPE) {
					if (openTimeout) {
						window.clearTimeout(openTimeout);
						openTimeout = null;
					}

					open.set(false);
				}
			};

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', () => {
					const $closeOnPointerDown = get(closeOnPointerDown);
					if (!$closeOnPointerDown) return;
					open.set(false);
					clickedTrigger = true;
					if (openTimeout) {
						window.clearTimeout(openTimeout);
						openTimeout = null;
					}
				}),
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					openTooltip('pointer');
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					if (openTimeout) {
						window.clearTimeout(openTimeout);
						openTimeout = null;
					}
				}),
				addMeltEventListener(node, 'focus', () => {
					if (clickedTrigger) return;
					openTooltip('focus');
				}),
				addMeltEventListener(node, 'blur', () => closeTooltip(true)),
				addMeltEventListener(node, 'keydown', keydownHandler),
				addEventListener(document, 'keydown', keydownHandler)
			);

			return {
				destroy: unsub,
			};
		},
	});

	const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
		return $open || $forceVisible;
	});

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
			let unsubFloating = noop;
			let unsubPortal = noop;

			const unsubDerived = effect(
				[isVisible, positioning, portal],
				([$isVisible, $positioning, $portal]) => {
					const triggerEl = getEl('trigger');
					if (!$isVisible || !triggerEl) {
						unsubPortal();
						unsubFloating();
						return;
					}

					const floatingReturn = useFloating(triggerEl, node, $positioning);
					unsubFloating = floatingReturn.destroy;
					if (!$portal) {
						unsubPortal();
						return;
					}
					const portalDest = getPortalDestination(node, $portal);
					if (portalDest) {
						const portalReturn = usePortal(node, portalDest);
						if (portalReturn && portalReturn.destroy) {
							unsubPortal = portalReturn.destroy;
						}
					}
				}
			);

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', () => openTooltip('pointer')),
				addMeltEventListener(node, 'pointerdown', () => openTooltip('pointer'))
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

	effect(open, ($open) => {
		const currentGroup = get(group);
		if (currentGroup === undefined || currentGroup === false) {
			return;
		}

		if (!$open) {
			if (groupMap.get(currentGroup) === open) {
				// Tooltip is no longer open
				groupMap.delete(currentGroup);
			}
			return;
		}

		// Close the currently open tooltip in the same group
		// and set this tooltip as the open one.
		const currentOpen = groupMap.get(currentGroup);
		currentOpen?.set(false);
		groupMap.set(currentGroup, open);
	});

	effect([open, openReason], ([$open, $openReason]) => {
		if (!$open || !isBrowser) return;
		return executeCallbacks(
			addEventListener(document, 'mousemove', (e) => {
				const contentEl = getEl('content');
				const triggerEl = getEl('trigger');
				if (!contentEl || !triggerEl) return;

				const polygonElements = get(disableHoverableContent) ? [triggerEl] : [triggerEl, contentEl];
				const polygon = makeHullFromElements(polygonElements);

				isMouseInTooltipArea = pointInPolygon(
					{
						x: e.clientX,
						y: e.clientY,
					},
					polygon
				);

				if ($openReason !== 'pointer') return;

				if (!isMouseInTooltipArea) {
					closeTooltip();
				}
			})
		);
	});

	return {
		ids,
		elements: {
			trigger,
			content,
			arrow,
		},
		states: { open },
		options,
	};
}
