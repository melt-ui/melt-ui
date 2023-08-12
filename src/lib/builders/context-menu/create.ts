import { usePopper } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	addMeltEventListener,
	builder,
	createElHelpers,
	derivedVisible,
	derivedWithUnsubscribe,
	effect,
	executeCallbacks,
	getNextFocusable,
	getPortalDestination,
	getPreviousFocusable,
	isHTMLElement,
	isLeftClick,
	kbd,
	noop,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
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
	setMeltMenuAttribute,
	type _MenuParts,
	type Point,
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
} satisfies CreateContextMenuProps;

const { name, selector } = createElHelpers<_MenuParts>('context-menu');

export function createContextMenu(props?: CreateContextMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateContextMenuProps;

	const rootOptions = toWritableStores(withDefaults);
	const { positioning, closeOnOutsideClick, portal, forceVisible, closeOnEscape } = rootOptions;

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const rootOpen = overridable(openWritable, withDefaults?.onOpenChange);
	const rootActiveTrigger = writable<HTMLElement | null>(null);
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const {
		item,
		createCheckboxItem,
		arrow,
		createSubmenu,
		createMenuRadioGroup,
		rootIds,
		separator,
		handleTypeaheadSearch,
		group,
		groupLabel,
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

	const point = writable<Point | null>(null);
	const virtual: Readable<VirtualElement | null> = derivedWithUnsubscribe([point], ([$point]) => {
		if ($point === null) return null;

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

	function handleClickOutside(e: PointerEvent) {
		if (e.defaultPrevented) return;

		const target = e.target;
		if (!isHTMLElement(target)) return;

		if (target.id === rootIds.trigger && isLeftClick(e)) {
			rootOpen.set(false);
			return;
		}

		if (target.id !== rootIds.trigger && !target.closest(selector())) {
			rootOpen.set(false);
		}
	}

	const isVisible = derivedVisible({
		open: rootOpen,
		forceVisible,
		activeTrigger: rootActiveTrigger,
	});

	const menu = builder(name(), {
		stores: [isVisible, portal],
		returned: ([$isVisible, $portal]) => {
			// We only want to render the menu when it's open and has an active trigger.
			return {
				role: 'menu',
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: rootIds.menu,
				'aria-labelledby': rootIds.trigger,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': $portal ? '' : undefined,
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
						const $virtual = get(virtual);
						const popper = usePopper(node, {
							anchorElement: $virtual ? $virtual : $rootActiveTrigger,
							open: rootOpen,
							options: {
								floating: $positioning,
								clickOutside: $closeOnOutsideClick
									? {
											handler: handleClickOutside,
									  }
									: null,
								portal: getPortalDestination(node, $portal),
								escapeKeydown: $closeOnEscape ? undefined : null,
							},
						});
						if (!popper || !popper.destroy) return;
						unsubPopper = popper.destroy;
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
						handleMenuNavigation(e);
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
		elements: {
			menu,
			trigger,
			item,
			arrow,
			separator,
			group,
			groupLabel,
		},
		states: {
			open: rootOpen,
		},
		builders: {
			createSubmenu,
			createCheckboxItem,
			createMenuRadioGroup,
		},
		options: rootOptions,
	};
}

/**
 * Check if the event is a touch or pen event
 * @param e The pointer event
 */
function isTouchOrPen(e: PointerEvent) {
	return e.pointerType !== 'mouse';
}
