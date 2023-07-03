import { usePopper } from '$lib/internal/actions/popper';
import {
	addEventListener,
	builder,
	createElHelpers,
	derivedWithUnsubscribe,
	effect,
	executeCallbacks,
	getNextFocusable,
	getPreviousFocusable,
	isHTMLElement,
	kbd,
	FIRST_LAST_KEYS,
	noop,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import type { VirtualElement } from '@floating-ui/core';
import { tick } from 'svelte';
import { get, writable, type Readable } from 'svelte/store';

import {
	applyAttrsIfDisabled,
	clearTimerStore,
	createMenuBuilder,
	getMenuItems,
	handleMenuNavigation,
	handleTabNavigation,
	type Menu,
	type Point,
	type MenuParts,
	setMeltMenuAttribute,
} from '../menu';

export type CreateContextMenu = Menu['builder'];
export type CreateContextMenuSub = Menu['submenu'];
export type ContextMenuItemArgs = Menu['item'];
export type ContextMenuCheckboxItemArgs = Menu['checkboxItem'];
export type CreateContextMenuRadioGroup = Menu['radioGroup'];
export type ContextMenuRadioItemArgs = Menu['radioItem'];
export type ContextMenuRadioItemActionArgs = Menu['radioItemAction'];

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom-start',
	},
	preventScroll: true,
} satisfies Defaults<CreateContextMenu>;

const { name, selector } = createElHelpers<MenuParts>('context-menu');

export function createContextMenu(args?: CreateContextMenu) {
	const withDefaults = { ...defaults, ...args } satisfies CreateContextMenu;
	const rootOptions = writable(withDefaults);
	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const {
		item,
		checkboxItem,
		arrow,
		createSubMenu,
		createMenuRadioGroup,
		rootIds,
		separator,
		handleTypeaheadSearch,
	} = createMenuBuilder({
		rootOpen,
		rootActiveTrigger,
		rootOptions,
		nextFocusable,
		prevFocusable,
		disableFocusFirstItem: true,
		disableTriggerRefocus: true,
		selector: 'context-menu',
	});

	const point = writable<Point>({ x: 0, y: 0 });
	const virtual: Readable<VirtualElement> = derivedWithUnsubscribe([point], ([$point]) => {
		return {
			getBoundingClientRect: () =>
				DOMRect.fromRect({
					width: 0,
					height: 0,
					...$point,
				}),
		};
	});
	const longPressTimer = writable(0);

	const menu = builder(name(), {
		stores: rootOpen,
		returned: ($rootOpen) => {
			return {
				role: 'menu',
				hidden: $rootOpen ? undefined : true,
				style: styleToString({
					display: $rootOpen ? undefined : 'none',
				}),
				id: rootIds.menu,
				'aria-labelledby': rootIds.trigger,
				'data-state': $rootOpen ? 'open' : 'closed',
				tabindex: -1,
			} as const;
		},
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[rootOpen, rootActiveTrigger, rootOptions],
				([$rootOpen, $rootActiveTrigger, $rootOptions]) => {
					unsubPopper();
					if ($rootOpen && $rootActiveTrigger) {
						tick().then(() => {
							setMeltMenuAttribute(node, selector);
							const $virtual = get(virtual);

							const popper = usePopper(node, {
								anchorElement: $virtual,
								open: rootOpen,
								options: {
									floating: $rootOptions.positioning,
									clickOutside: {
										handler: (e: PointerEvent) => {
											if (e.defaultPrevented) return;
											const target = e.target;
											if (!isHTMLElement(target)) return;

											if (target.id === rootIds.trigger && e.button === 0) {
												rootOpen.set(false);
												return;
											}

											if (target.id !== rootIds.trigger && !target.closest(selector())) {
												rootOpen.set(false);
											}
										},
									},
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				}
			);

			const unsubEvents = executeCallbacks(
				addEventListener(node, 'keydown', (e) => {
					const target = e.target;
					if (!isHTMLElement(target)) return;

					const menuElement = e.currentTarget;
					if (!isHTMLElement(menuElement)) return;

					/**
					 * Submenu key events bubble through portals and
					 * we only care about key events that happen inside this menu.
					 */
					const isKeyDownInside = target.closest("[role='menu']") === menuElement;
					if (!isKeyDownInside) return;
					if (FIRST_LAST_KEYS.includes(e.key)) {
						handleMenuNavigation(e);
					}

					/**
					 * Menus should not be navigated using tab, so we prevent it.
					 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					 */
					if (e.key === kbd.TAB) {
						e.preventDefault();
						rootActiveTrigger.set(null);
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
						handleTypeaheadSearch(e.key, getMenuItems(menuElement));
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

	const trigger = builder(name('trigger'), {
		stores: rootOpen,
		returned: ($rootOpen) => {
			return {
				'aria-controls': rootIds.menu,
				'aria-expanded': $rootOpen,
				'data-state': $rootOpen ? 'open' : 'closed',
				id: rootIds.trigger,
				style: styleToString({
					WebkitTouchCallout: 'none',
				}),
			} as const;
		},
		action: (node: HTMLElement) => {
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
				addEventListener(node, 'contextmenu', (e) => {
					/**
					 * Clear the long press because some platforms already
					 * fire a contextmenu event on long press.
					 */
					clearTimerStore(longPressTimer);
					handleOpen(e);
					e.preventDefault();
				}),
				addEventListener(node, 'pointerdown', (e) => {
					if (!isTouchOrPen(e)) return;

					// Clear the long press in case there's multiple touchpoints
					clearTimerStore(longPressTimer);

					longPressTimer.set(window.setTimeout(() => handleOpen(e), 700));
				}),
				addEventListener(node, 'pointermove', (e) => {
					if (!isTouchOrPen(e)) return;

					clearTimerStore(longPressTimer);
				}),
				addEventListener(node, 'pointercancel', (e) => {
					if (!isTouchOrPen(e)) return;

					clearTimerStore(longPressTimer);
				}),
				addEventListener(node, 'pointerup', (e) => {
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
		trigger,
		menu,
		open: rootOpen,
		item,
		checkboxItem,
		arrow,
		options: rootOptions,
		createSubMenu,
		createMenuRadioGroup,
		separator,
	};
}

/**
 * Check if the event is a touch or pen event
 * @param e The pointer event
 */
function isTouchOrPen(e: PointerEvent) {
	return e.pointerType !== 'mouse';
}
