import { usePopper } from '$lib/internal/actions/popper';
import {
	derivedWithUnsubscribe,
	effect,
	kbd,
	styleToString,
	isHTMLElement,
	noop,
	executeCallbacks,
	addEventListener,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { VirtualElement } from '@floating-ui/core';

import {
	clearTimerStore,
	createMenuBuilder,
	setMeltMenuAttribute,
	type Point,
	handleMenuNavigation,
	getMenuItems,
	applyAttrsIfDisabled,
	type Menu,
} from '../menu';

const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

export type ContextMenuArgs = Menu['builder'];
export type ContextMenuSubArgs = Menu['submenu'];
export type ContextMenuItemArgs = Menu['item'];
export type ContextMenuCheckboxItemArgs = Menu['checkboxItem'];
export type ContextMenuRadioGroup = Menu['radioGroup'];
export type ContextMenuRadioItemArgs = Menu['radioItem'];
export type ContextMenuRadioItemActionArgs = Menu['radioItemAction'];

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom-start',
	},
	preventScroll: true,
} satisfies Defaults<ContextMenuArgs>;

export function createContextMenu(args?: ContextMenuArgs) {
	const withDefaults = { ...defaults, ...args } as ContextMenuArgs;
	const rootOptions = writable(withDefaults);
	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);

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

	const menu = {
		...derived([rootOpen], ([$rootOpen]) => {
			return {
				role: 'menu',
				hidden: $rootOpen ? undefined : true,
				style: styleToString({
					display: $rootOpen ? undefined : 'none',
				}),
				id: rootIds.menu,
				'aria-labelledby': rootIds.trigger,
				'data-melt-part': 'menu',
				'data-melt-menu': '',
				'data-state': $rootOpen ? 'open' : 'closed',
				tabindex: -1,
			} as const;
		}),
		action: (node: HTMLElement) => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[rootOpen, rootActiveTrigger, rootOptions],
				([$rootOpen, $rootActiveTrigger, $rootOptions]) => {
					unsubPopper();
					if ($rootOpen && $rootActiveTrigger) {
						tick().then(() => {
							setMeltMenuAttribute(node);
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

											if (target.id !== rootIds.trigger && !target.closest('[data-melt-menu]')) {
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
					const isKeyDownInside = target.closest('[data-melt-menu]') === menuElement;
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
	};

	const trigger = {
		...derived([rootOpen], ([$rootOpen]) => {
			return {
				'aria-controls': rootIds.menu,
				'aria-expanded': $rootOpen,
				'data-state': $rootOpen ? 'open' : 'closed',
				id: rootIds.trigger,
				'data-melt-part': 'trigger',
				style: styleToString({
					WebkitTouchCallout: 'none',
				}),
			} as const;
		}),
		action: (node: HTMLElement) => {
			applyAttrsIfDisabled(node);

			const handleOpen = (e: MouseEvent | PointerEvent) => {
				point.set({
					x: e.clientX,
					y: e.clientY,
				});
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
	};

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
