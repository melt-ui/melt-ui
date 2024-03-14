import { usePopper, type InteractOutsideEvent } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	addMeltEventListener,
	makeElement,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	getNextFocusable,
	getPortalDestination,
	getPreviousFocusable,
	isHTMLElement,
	kbd,
	noop,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	withGet,
	type WithGet,
	portalAttr,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { VirtualElement } from '@floating-ui/core';
import { tick } from 'svelte';
import { derived, writable, type Readable } from 'svelte/store';
import {
	applyAttrsIfDisabled,
	clearTimerStore,
	createMenuBuilder,
	getMenuItems,
	handleMenuNavigation,
	handleTabNavigation,
	setMeltMenuAttribute,
	type Point,
	type _MenuParts,
} from '../menu/index.js';
import type { ContextMenuEvents } from './events.js';
import type { CreateContextMenuProps } from './types.js';

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom-start',
	},
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	portal: undefined,
	loop: false,
	dir: 'ltr',
	defaultOpen: false,
	forceVisible: false,
	typeahead: true,
	disableFocusFirstItem: true,
	closeFocus: undefined,
	closeOnItemClick: true,
	onOutsideClick: undefined,
} satisfies CreateContextMenuProps;

const { name, selector } = createElHelpers<_MenuParts>('context-menu');

export function createContextMenu(props?: CreateContextMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateContextMenuProps;

	const rootOptions = toWritableStores(omit(withDefaults, 'ids'));
	const { positioning, closeOnOutsideClick, portal, forceVisible, closeOnEscape, loop } =
		rootOptions;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const rootOpen = overridable(openWritable, withDefaults?.onOpenChange);
	const rootActiveTrigger = writable<HTMLElement | null>(null);
	const nextFocusable = withGet.writable<HTMLElement | null>(null);
	const prevFocusable = withGet.writable<HTMLElement | null>(null);

	const { elements, builders, ids, options, helpers, states } = createMenuBuilder({
		rootOpen,
		rootOptions,
		rootActiveTrigger: withGet(rootActiveTrigger),
		nextFocusable: withGet(nextFocusable),
		prevFocusable: withGet(prevFocusable),
		selector: 'context-menu',
		removeScroll: true,
		ids: withDefaults.ids,
	});

	const { handleTypeaheadSearch } = helpers;

	const point = writable<Point | null>(null);
	const virtual: WithGet<Readable<VirtualElement | null>> = withGet(
		derived([point], ([$point]) => {
			if ($point === null) return null;

			return {
				getBoundingClientRect: () =>
					DOMRect.fromRect({
						width: 0,
						height: 0,
						...$point,
					}),
			};
		})
	);
	const longPressTimer = withGet.writable(0);

	function handleClickOutside(e: InteractOutsideEvent) {
		rootOptions.onOutsideClick.get()?.(e);
		if (e.defaultPrevented) return false;

		const target = e.target;
		if (!(target instanceof Element)) return false;

		const isClickInsideTrigger = target.closest(`[data-id="${ids.trigger.get()}"]`) !== null;

		if (!isClickInsideTrigger || isLeftClick(e)) {
			return true;
		}

		return false;
	}

	const isVisible = derivedVisible({
		open: rootOpen,
		forceVisible,
		activeTrigger: rootActiveTrigger,
	});

	const menu = makeElement(name(), {
		stores: [isVisible, portal, ids.menu, ids.trigger],
		returned: ([$isVisible, $portal, $menuId, $triggerId]) => {
			// We only want to render the menu when it's open and has an active trigger.
			return {
				role: 'menu',
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: $menuId,
				'aria-labelledby': $triggerId,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': portalAttr($portal),
				tabindex: -1,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<ContextMenuEvents['menu']> => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[isVisible, rootActiveTrigger, positioning, closeOnOutsideClick, portal, closeOnEscape],
				([
					$isVisible,
					$rootActiveTrigger,
					$positioning,
					$closeOnOutsideClick,
					$portal,
					$closeOnEscape,
				]) => {
					unsubPopper();
					if (!$isVisible || !$rootActiveTrigger) return;
					tick().then(() => {
						setMeltMenuAttribute(node, selector);
						const $virtual = virtual.get();
						unsubPopper = usePopper(node, {
							anchorElement: $virtual ? $virtual : $rootActiveTrigger,
							open: rootOpen,
							options: {
								floating: $positioning,
								modal: {
									closeOnInteractOutside: $closeOnOutsideClick,
									onClose: () => {
										rootOpen.set(false);
									},
									shouldCloseOnInteractOutside: handleClickOutside,
									open: $isVisible,
								},
								portal: getPortalDestination(node, $portal),
								escapeKeydown: $closeOnEscape ? undefined : null,
							},
						}).destroy;
					});
				}
			);

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					const target = e.target;
					const menuEl = e.currentTarget;
					if (!isHTMLElement(target) || !isHTMLElement(menuEl)) return;

					/**
					 * Submenu key events bubble through portals and
					 * we only care about key events that happen inside this menu.
					 */
					const isKeyDownInside = target.closest("[role='menu']") === menuEl;
					if (!isKeyDownInside) return;
					if (FIRST_LAST_KEYS.includes(e.key)) {
						handleMenuNavigation(e, loop.get());
					}

					/**
					 * Menus should not be navigated using tab, so we prevent it.
					 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					 */
					if (e.key === kbd.TAB) {
						e.preventDefault();
						rootOpen.set(false);
						handleTabNavigation(e, nextFocusable, prevFocusable);
						return;
					}

					/**
					 * Check for typeahead search and handle it.
					 */
					const isCharacterKey = e.key.length === 1;
					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					if (!isModifierKey && isCharacterKey) {
						handleTypeaheadSearch(e.key, getMenuItems(menuEl));
					}
				})
			);
			return {
				destroy() {
					unsubDerived();
					unsubEvents();
					unsubPopper();
				},
			};
		},
	});

	const trigger = makeElement(name('trigger'), {
		stores: [rootOpen, ids.trigger],
		returned: ([$rootOpen, $triggerId]) => {
			return {
				'data-state': $rootOpen ? 'open' : 'closed',
				id: $triggerId,
				style: styleToString({
					WebkitTouchCallout: 'none',
				}),
				'data-id': $triggerId,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<ContextMenuEvents['trigger']> => {
			applyAttrsIfDisabled(node);

			const handleOpen = (e: MouseEvent | PointerEvent) => {
				point.set({
					x: e.clientX,
					y: e.clientY,
				});
				nextFocusable.set(getNextFocusable(node));
				prevFocusable.set(getPreviousFocusable(node));
				rootActiveTrigger.set(node);
				rootOpen.set(true);
			};

			const unsubTimer = () => {
				clearTimerStore(longPressTimer);
			};

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'contextmenu', (e) => {
					/**
					 * Clear the long press because some platforms already
					 * fire a contextmenu event on long press.
					 */
					clearTimerStore(longPressTimer);
					handleOpen(e);
					e.preventDefault();
				}),
				addMeltEventListener(node, 'pointerdown', (e) => {
					if (!isTouchOrPen(e)) return;

					// Clear the long press in case there's multiple touchpoints
					clearTimerStore(longPressTimer);

					longPressTimer.set(window.setTimeout(() => handleOpen(e), 700));
				}),
				addMeltEventListener(node, 'pointermove', (e) => {
					if (!isTouchOrPen(e)) return;

					clearTimerStore(longPressTimer);
				}),
				addMeltEventListener(node, 'pointercancel', (e) => {
					if (!isTouchOrPen(e)) return;

					clearTimerStore(longPressTimer);
				}),
				addMeltEventListener(node, 'pointerup', (e) => {
					if (!isTouchOrPen(e)) return;

					clearTimerStore(longPressTimer);
				})
			);

			return {
				destroy() {
					unsubTimer();
					unsub();
				},
			};
		},
	});

	return {
		ids,
		elements: {
			...elements,
			menu,
			trigger,
		},
		states,
		builders,
		options,
	};
}

/**
 * Check if the event is a touch or pen event
 * @param e The pointer event
 */
function isTouchOrPen(e: PointerEvent) {
	return e.pointerType !== 'mouse';
}

export function isLeftClick(event: InteractOutsideEvent): boolean {
	if ('button' in event) {
		return event.button === 0 && event.ctrlKey === false && event.metaKey === false;
	}
	return true;
}
