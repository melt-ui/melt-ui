import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	derivedWithUnsubscribe,
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	sleep,
	styleToString,
	uuid,
	type EventHandler,
	isHTMLElement,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable, type Writable } from 'svelte/store';

type Direction = 'ltr' | 'rtl';

const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const SUB_OPEN_KEYS: Record<Direction, string[]> = {
	ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
	rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT],
};
const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
	ltr: [kbd.ARROW_LEFT],
	rtl: [kbd.ARROW_RIGHT],
};

export type CreateDropdownMenuArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	disabled?: boolean;
	name?: string;
	defaults?: {
		onItemSelect?: EventHandler<MouseEvent>;
	};
};

const defaults = {
	arrowSize: 8,
	disabled: false,
	positioning: {
		placement: 'bottom',
	},
} satisfies Defaults<CreateDropdownMenuArgs>;

export function createDropdownMenu(args?: CreateDropdownMenuArgs) {
	const withDefaults = { ...defaults, ...args } as CreateDropdownMenuArgs;
	const rootOptions = writable(withDefaults);

	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);

	const lastPointerX = writable(0);
	const isUsingKeyboard = writable(false);
	const pointerGraceIntent = writable<GraceIntent | null>(null);
	const pointerDir = writable<Side>('right');

	const pointerMovingToSubmenu = derivedWithUnsubscribe(
		[pointerDir, pointerGraceIntent],
		([$pointerDir, $pointerGraceIntent]) => {
			return (event: PointerEvent) => {
				const isMovingTowards = $pointerDir === $pointerGraceIntent?.side;

				return isMovingTowards && isPointerInGraceArea(event, $pointerGraceIntent?.area);
			};
		}
	);

	const rootIds = {
		menu: uuid(),
		trigger: uuid(),
	};

	const rootMenu = elementDerived(
		[rootOpen, rootActiveTrigger, rootOptions],
		([$rootOpen, $rootActiveTrigger, $rootOptions], { addAction, attach }) => {
			if ($rootOpen && $rootActiveTrigger) {
				addAction(usePopper, {
					anchorElement: $rootActiveTrigger,
					open: rootOpen,
					options: {
						floating: $rootOptions.positioning,
						focusTrap: null,
					},
				});

				attach('keydown', (event) => {
					// submenu key events bubble through portals
					// we only care about key events that happen inside this menu
					const target = event.target;
					if (!isHTMLElement(target)) return;

					const isKeyDownInside = target.closest('[data-melt-menu]') === event.currentTarget;

					const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
					const isCharacterKey = event.key.length === 1;
					if (!isKeyDownInside) return;

					if (FIRST_LAST_KEYS.includes(event.key)) {
						handleMenuNavigation(event);
					}

					// menus should not be navigated using tab so we prevent it
					// reference: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					if (event.key === 'Tab') event.preventDefault();

					if (!isModifierKey && isCharacterKey) {
						// typeahead logic
					}
				});
			}

			return {
				role: 'menu',
				hidden: $rootOpen ? undefined : true,
				style: styleToString({
					display: $rootOpen ? undefined : 'none',
				}),
				id: rootIds.menu,
				'aria-labelledby': rootIds.trigger,
				'data-melt-part': 'menu-root',
				'data-melt-menu': '',
				tabindex: -1,
			};
		}
	);

	const rootTrigger = elementDerived(
		[rootOpen, rootOptions],
		([$rootOpen, $rootOptions], { attach }) => {
			attach('pointerdown', (event) => {
				const triggerElement = event.currentTarget;
				if (!isHTMLElement(triggerElement)) return;

				const triggerControls = triggerElement.getAttribute('aria-controls');
				if (!triggerControls) return;

				rootOpen.update((prev) => {
					const isOpen = !prev;
					if (isOpen) {
						rootActiveTrigger.set(triggerElement);
					} else {
						rootActiveTrigger.set(null);
					}

					return isOpen;
				});
				if (!$rootOpen) event.preventDefault();
			});

			attach('keydown', (event) => {
				const triggerElement = event.currentTarget;
				if (!isHTMLElement(triggerElement)) return;

				if (SELECTION_KEYS.includes(event.key) || event.key === kbd.ARROW_DOWN) {
					rootOpen.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							rootActiveTrigger.set(triggerElement);
						} else {
							rootActiveTrigger.set(null);
						}

						return isOpen;
					});

					const menuId = triggerElement.getAttribute('aria-controls');
					if (!menuId) return;

					const menu = document.getElementById(menuId);
					if (!isHTMLElement(menu)) return;

					const menuItems = getMenuItems(menu);
					if (!menuItems.length) return;

					const nextFocusedElement = menuItems[0];
					if (!isHTMLElement(nextFocusedElement)) return;

					handleRovingFocus(nextFocusedElement);
				}

				event.preventDefault();
			});

			return {
				'aria-controls': rootIds.menu,
				'aria-expanded': $rootOpen,
				'data-state': $rootOpen ? 'open' : 'closed',
				'data-disabled': $rootOptions.disabled ? '' : undefined,
				id: rootIds.trigger,
			};
		}
	);

	const rootArrow = derived(rootOptions, ($rootOptions) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$rootOptions.arrowSize}px)`,
			height: `var(--arrow-size, ${$rootOptions.arrowSize}px)`,
		}),
	}));

	type ItemArgs = {
		disabled?: boolean;
		disableDefault?: boolean;
	};

	const itemDefaults = {
		disabled: false,
		disableDefault: false,
	} satisfies Defaults<ItemArgs>;

	const item = elementMultiDerived([rootOptions], ([$rootOptions], { attach, getElement }) => {
		return (args?: ItemArgs) => {
			const itemArgs = { ...itemDefaults, ...args } as ItemArgs;
			getElement().then((element) => setMeltMenuAttribute(element));

			attach('click', (event) => {
				if (event.defaultPrevented) {
					const currentTarget = event.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					handleRovingFocus(currentTarget);
					return;
				}

				if (itemArgs.disabled) {
					return;
				}
				if (!itemArgs.disableDefault && $rootOptions.defaults?.onItemSelect) {
					$rootOptions.defaults.onItemSelect(event);
				}

				rootOpen.set(false);
			});

			attach('keydown', (event) => {
				if (SELECTION_KEYS.includes(event.key)) {
					const currentTarget = event.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					currentTarget.click();
					/**
					 * We prevent default browser behaviour for selection keys as they should trigger
					 * a selection only:
					 * - prevents space from scrolling the page.
					 * - if keydown causes focus to move, prevents keydown from firing on the new target.
					 */
					event.preventDefault();
				}
			});

			attach('pointermove', (event) => {
				onMenuItemPointerMove(event);
			});

			attach('pointerleave', (event) => {
				onMenuItemPointerLeave(event);
			});

			return {
				role: 'menuitem',
				tabindex: -1,
			};
		};
	});

	/* -------------------------------------------------------------------------------------------------
	 * SUBMENU
	 * -----------------------------------------------------------------------------------------------*/

	const subMenuDefaults = {
		...defaults,
		positioning: {
			placement: 'right-start',
			gutter: 8,
		},
	} satisfies Defaults<CreateDropdownMenuArgs>;

	const createSubMenu = (args?: CreateDropdownMenuArgs) => {
		const withDefaults = { ...subMenuDefaults, ...args } as CreateDropdownMenuArgs;
		const subOptions = writable(withDefaults);

		const subOpen = writable(false);
		const subActiveTrigger = writable<HTMLElement | null>(null);
		const subOpenTimer = writable<number | null>(null);
		const pointerGraceTimer = writable(0);

		const subIds = {
			menu: uuid(),
			trigger: uuid(),
		};

		const subMenu = elementDerived(
			[subOpen, subActiveTrigger, subOptions],
			([$subOpen, $subActiveTrigger, $subOptions], { addAction, attach }) => {
				if ($subOpen && $subActiveTrigger) {
					const parentMenuEl = getParentMenu($subActiveTrigger);

					addAction(usePopper, {
						anchorElement: $subActiveTrigger,
						open: subOpen,
						options: {
							floating: $subOptions.positioning,
							clickOutside: null,
							portal: isHTMLElement(parentMenuEl) ? parentMenuEl : undefined,
							focusTrap: null,
						},
					});
				}

				attach('keydown', (event) => {
					if (event.key === kbd.ESCAPE) {
						return;
					}

					// Submenu key events bubble through portals.
					// We only want the keys in this menu.
					const target = event.target;
					if (!isHTMLElement(target)) return;

					const currentTarget = event.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					const targetMeltMenuId = target.getAttribute('data-melt-menu-id');
					if (!targetMeltMenuId) return;

					const isKeyDownInside =
						target.closest('[data-melt-menu]') === currentTarget &&
						targetMeltMenuId === currentTarget.id;

					const isCloseKey = SUB_CLOSE_KEYS['ltr'].includes(event.key);
					const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
					const isCharacterKey = event.key.length === 1;

					if (!isKeyDownInside) return;

					if (FIRST_LAST_KEYS.includes(event.key)) {
						// prevent events from bubbling
						event.stopImmediatePropagation();
						handleMenuNavigation(event);
					}

					// close the submenu if the user presses a close key
					if (isCloseKey) {
						event.preventDefault();
						subOpen.update(() => {
							if ($subActiveTrigger) {
								handleRovingFocus($subActiveTrigger);
							}
							subActiveTrigger.set(null);
							return false;
						});
					}

					// menus should not be navigated using tab so we prevent it
					// reference: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					if (event.key === 'Tab') event.preventDefault();
					if (!isModifierKey && isCharacterKey) {
						// typeahead logic
					}
				});

				attach('pointermove', (event) => {
					onMenuPointerMove(event);
				});

				attach('focusout', (event) => {
					if (get(isUsingKeyboard)) {
						const target = event.target;
						if (!isHTMLElement(target)) return;

						const submenuElement = document.getElementById(subIds.menu);
						if (!isHTMLElement(submenuElement)) return;

						if (!submenuElement?.contains(target) && target !== $subActiveTrigger) {
							subOpen.set(false);
							subActiveTrigger.set(null);
						}
					} else {
						const menuElement = event.currentTarget;
						if (!isHTMLElement(menuElement)) return;

						const relatedTarget = event.relatedTarget;
						if (!isHTMLElement(relatedTarget)) return;

						if (!menuElement.contains(relatedTarget) && relatedTarget !== $subActiveTrigger) {
							subOpen.set(false);
							subActiveTrigger.set(null);
						}
					}
				});

				return {
					role: 'menu',
					hidden: $subOpen ? undefined : true,
					style: styleToString({
						display: $subOpen ? undefined : 'none',
					}),
					id: subIds.menu,
					'aria-labelledby': subIds.trigger,
					'data-melt-part': 'menu-sub',
					'data-melt-menu': '',
					tabindex: -1,
				};
			}
		);

		const subTrigger = elementDerived(
			[subOpen, subOptions],
			([$subOpen, $subOptions], { attach, getElement, addUnsubscriber }) => {
				getElement().then((element) => setMeltMenuAttribute(element));

				addUnsubscriber(() => {
					if (!isBrowser) return;
					clearOpenTimer(subOpenTimer);
					window.clearTimeout(get(pointerGraceTimer));
					pointerGraceIntent.set(null);
				});

				attach('click', (event) => {
					// Manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
					const currentTarget = event.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					handleRovingFocus(currentTarget);
					if (!get(subOpen)) {
						subOpen.update((prev) => {
							const isAlreadyOpen = prev;
							if (!isAlreadyOpen) {
								subActiveTrigger.set(currentTarget);
								return !prev;
							}
							return prev;
						});
					}
				});

				attach('keydown', (event) => {
					if (SUB_OPEN_KEYS['ltr'].includes(event.key)) {
						const currentTarget = event.currentTarget;
						if (!isHTMLElement(currentTarget)) return;

						if (!$subOpen) {
							currentTarget.click();
							event.preventDefault();
							return;
						}

						const menuId = currentTarget.getAttribute('aria-controls');
						if (!menuId) return;

						const menuElement = document.getElementById(menuId);
						if (!isHTMLElement(menuElement)) return;

						const firstItem = getMenuItems(menuElement)[0];
						if (!isHTMLElement(firstItem)) return;

						handleRovingFocus(firstItem);
					}
					return;
				});

				attach('pointermove', (event) => {
					if (!isMouse(event)) return;

					onItemEnter(event);

					if (event.defaultPrevented) return;

					const currentTarget = event.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					handleRovingFocus(currentTarget);

					const openTimer = get(subOpenTimer);
					if (!$subOpen && !openTimer) {
						subOpenTimer.set(
							window.setTimeout(() => {
								subOpen.update(() => {
									subActiveTrigger.set(currentTarget);
									return true;
								});
								clearOpenTimer(subOpenTimer);
							}, 100)
						);
					}
				});

				attach('pointerleave', (event) => {
					if (!isMouse(event)) return;
					clearOpenTimer(subOpenTimer);

					const submenuElement = document.getElementById(subIds.menu);
					const contentRect = submenuElement?.getBoundingClientRect();

					if (contentRect) {
						const side = submenuElement?.dataset.side as Side;
						const rightSide = side === 'right';
						const bleed = rightSide ? -5 : +5;
						const contentNearEdge = contentRect[rightSide ? 'left' : 'right'];
						const contentFarEdge = contentRect[rightSide ? 'right' : 'left'];

						pointerGraceIntent.set({
							area: [
								// Apply a bleed on clientX to ensure that our exit point is
								// consistently within polygon bounds
								{ x: event.clientX + bleed, y: event.clientY },
								{ x: contentNearEdge, y: contentRect.top },
								{ x: contentFarEdge, y: contentRect.top },
								{ x: contentFarEdge, y: contentRect.bottom },
								{ x: contentNearEdge, y: contentRect.bottom },
							],
							side,
						});

						window.clearTimeout(get(pointerGraceTimer));
						pointerGraceTimer.set(
							window.setTimeout(() => {
								pointerGraceIntent.set(null);
							}, 300)
						);
					} else {
						onTriggerLeave(event);
						if (event.defaultPrevented) return;

						// There's 100ms where the user may leave an item before the submenu was opened.
						pointerGraceIntent.set(null);
					}
				});

				attach('focusout', (event) => {
					const target = event.target;
					if (!isHTMLElement(target)) return;

					const relatedTarget = event.relatedTarget;
					if (!isHTMLElement(relatedTarget)) return;

					const menuId = target.getAttribute('aria-controls');
					if (!menuId) return;

					const menu = document.getElementById(menuId);

					if (isHTMLElement(menu) && !menu.contains(relatedTarget)) {
						subActiveTrigger.set(null);
						subOpen.set(false);
					}
				});

				return {
					role: 'menuitem',
					id: subIds.trigger,
					tabindex: -1,
					'aria-controls': subIds.menu,
					'aria-expanded': $subOpen,
					'data-state': $subOpen ? 'open' : 'closed',
					'data-disabled': $subOptions.disabled ? '' : undefined,
					'data-melt-part': 'menu-sub-trigger',
					'aria-haspopop': 'menu',
				};
			}
		);

		const subArrow = derived(subOptions, ($subOptions) => ({
			'data-arrow': true,
			style: styleToString({
				position: 'absolute',
				width: `var(--arrow-size, ${$subOptions.arrowSize}px)`,
				height: `var(--arrow-size, ${$subOptions.arrowSize}px)`,
			}),
		}));

		/* -------------------------------------------------------------------------------------------------
		 * Sub Menu Effects
		 * -----------------------------------------------------------------------------------------------*/

		effect([rootOpen], ([$rootOpen]) => {
			if (!$rootOpen) {
				subActiveTrigger.set(null);
				subOpen.set(false);
			}
		});

		effect([pointerGraceIntent], ([$pointerGraceIntent]) => {
			if (!isBrowser) return;
			if (!$pointerGraceIntent) {
				window.clearTimeout(get(pointerGraceTimer));
			}
		});

		effect([subOpen, subMenu, subActiveTrigger], ([$subOpen, $subMenu, $subActiveTrigger]) => {
			if (!isBrowser) return;
			const menuElement = getElementByMeltId($subMenu['data-melt-id']);
			if (isHTMLElement(menuElement) && $subOpen && get(isUsingKeyboard)) {
				// Selector to get menu items belonging to menu
				const rootMenuItemSelector = `[role="menuitem"][data-melt-menu-id="${menuElement.id}"]`;

				// Focus on first menu item
				const firstOption = document.querySelector(rootMenuItemSelector);

				if (get(isUsingKeyboard)) {
					sleep(1).then(() =>
						isHTMLElement(firstOption) ? handleRovingFocus(firstOption) : undefined
					);
				}
			} else if (!$subOpen && $subActiveTrigger && isBrowser) {
				sleep(1).then(() => handleRovingFocus($subActiveTrigger));
			}
		});

		return {
			subTrigger,
			subMenu,
			subOpen,
			subArrow,
			subOptions,
		};
	};

	/* -------------------------------------------------------------------------------------------------
	 * Root Effects
	 * -----------------------------------------------------------------------------------------------*/
	effect([rootOpen, rootActiveTrigger], ([$rootOpen, $rootActiveTrigger]) => {
		if (!isBrowser) return;
		const rootMenuElement = document.getElementById(rootIds.menu);
		if (rootMenuElement && $rootOpen) {
			handleRovingFocus(rootMenuElement);
		}
		if (!$rootOpen && $rootActiveTrigger) {
			handleRovingFocus($rootActiveTrigger);
		}
	});

	effect([rootOpen, rootMenu, rootActiveTrigger], ([$rootOpen, $rootMenu, $rootActiveTrigger]) => {
		if (!isBrowser) return;

		const menuElement = getElementByMeltId($rootMenu['data-melt-id']);

		if (menuElement && $rootOpen) {
			const handlePointer = () => isUsingKeyboard.set(false);
			const handleKeyDown = () => {
				isUsingKeyboard.set(true);
				document.addEventListener('pointerdown', handlePointer, { capture: true, once: true });
				document.addEventListener('pointermove', handlePointer, { capture: true, once: true });
			};
			document.addEventListener('keydown', handleKeyDown, { capture: true });

			const keydownListener = (event: KeyboardEvent) => {
				if (event.key === kbd.ESCAPE) {
					rootOpen.set(false);
					return;
				}
			};
			document.addEventListener('keydown', keydownListener);

			return () => {
				document.removeEventListener('keydown', handleKeyDown, { capture: true });
				document.removeEventListener('pointerdown', handlePointer, { capture: true });
				document.removeEventListener('pointermove', handlePointer, { capture: true });
				document.removeEventListener('keydown', keydownListener);
			};
		} else if (!$rootOpen && $rootActiveTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => handleRovingFocus($rootActiveTrigger));
		}
	});

	/* -------------------------------------------------------------------------------------------------
	 * Pointer Event Effects
	 * -----------------------------------------------------------------------------------------------*/

	function onItemEnter(event: PointerEvent) {
		if (isPointerMovingToSubmenu(event)) {
			event.preventDefault();
		}
	}

	function onItemLeave(event: PointerEvent) {
		if (isPointerMovingToSubmenu(event)) {
			return;
		}
		const target = event.target;
		if (!isHTMLElement(target)) return;

		const parentMenuElement = getParentMenu(target);
		if (!isHTMLElement(parentMenuElement)) return;

		handleRovingFocus(parentMenuElement);
	}

	function onTriggerLeave(event: PointerEvent) {
		if (isPointerMovingToSubmenu(event)) {
			event.preventDefault();
		}
	}

	function onMenuPointerMove(event: PointerEvent) {
		if (!isMouse(event)) return;

		const target = event.target;
		if (!isHTMLElement(target)) return;

		const currentTarget = event.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		const $lastPointerX = get(lastPointerX);
		const pointerXHasChanged = $lastPointerX !== event.clientX;

		// We don't use `event.movementX` for this check because Safari will
		// always return `0` on a pointer event.
		if (currentTarget.contains(target) && pointerXHasChanged) {
			const newDir = event.clientX > $lastPointerX ? 'right' : 'left';
			pointerDir.set(newDir);
			lastPointerX.set(event.clientX);
		}
	}

	function onMenuItemPointerMove(event: PointerEvent) {
		if (!isMouse(event)) return;
		onItemEnter(event);
		if (!event.defaultPrevented) {
			const currentTarget = event.currentTarget;
			if (!isHTMLElement(currentTarget)) return;
			// focus on the current menu item
			handleRovingFocus(currentTarget);
		}
	}

	function onMenuItemPointerLeave(event: PointerEvent) {
		if (!isMouse(event)) return;
		onItemLeave(event);
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	/**
	 * Manage roving focus between elements. Sets the current active element to
	 * tabindex -1 and the next element to tabindex 0.
	 *
	 * @param nextElement The element to focus on
	 */
	function handleRovingFocus(nextElement: HTMLElement) {
		if (!isBrowser) return;

		const currentFocusedElement = document.activeElement;
		if (!isHTMLElement(currentFocusedElement)) return;

		// if we already have focus on the next element, do nothing
		if (currentFocusedElement === nextElement) return;

		currentFocusedElement.tabIndex = -1;
		nextElement.tabIndex = 0;

		sleep(1).then(() => nextElement.focus());
	}

	function isPointerMovingToSubmenu(event: PointerEvent) {
		return get(pointerMovingToSubmenu)(event);
	}

	/**
	 * Check if the event is a mouse event
	 * @param event The pointer event
	 */
	function isMouse(event: PointerEvent) {
		return event.pointerType === 'mouse';
	}

	/**
	 * Given a timer store, clear the timeout and set the store to null
	 * @param openTimer The timer store
	 */
	function clearOpenTimer(openTimer: Writable<number | null>) {
		if (!isBrowser) return;
		const timer = get(openTimer);
		if (timer) {
			window.clearTimeout(timer);
			openTimer.set(null);
		}
	}

	/**
	 * Keyboard event handler for menu navigation
	 * @param event The keyboard event
	 */
	function handleMenuNavigation(event: KeyboardEvent) {
		event.preventDefault();

		// currently focused menu item
		const currentFocusedItem = document.activeElement;
		if (!isHTMLElement(currentFocusedItem)) return;

		// menu element being navigated
		const currentTarget = event.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		// menu items of the current menu
		const candidateNodes = getMenuItems(currentTarget);
		if (!candidateNodes.length) return;

		// Index of the currently focused item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);

		// Calculate the index of the next menu item
		let nextIndex: number;
		switch (event.key) {
			case kbd.ARROW_DOWN:
				nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : currentIndex;
				break;
			case kbd.ARROW_UP:
				nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
				break;
			case kbd.HOME:
				nextIndex = 0;
				break;
			case kbd.END:
				nextIndex = candidateNodes.length - 1;
				break;
			default:
				return;
		}

		const nextFocusedItem = candidateNodes[nextIndex];

		handleRovingFocus(nextFocusedItem);
	}

	/**
	 * Get the parent menu element for a menu item.
	 * @param element The menu item element
	 */
	function getParentMenu(element: HTMLElement) {
		return element.closest('[role="menu"]');
	}

	/**
	 * Set the `data-melt-menu-id` attribute on a menu item element.
	 * @param element The menu item element
	 */
	function setMeltMenuAttribute(element: HTMLElement | null) {
		if (!element) return;
		const menuEl = element.closest('[data-melt-part="menu-root"], [data-melt-part="menu-sub"]');

		if (!isHTMLElement(menuEl)) return;
		element.setAttribute('data-melt-menu-id', menuEl.id);
	}

	/**
	 * Get the menu items for a given menu element.
	 * This only selects menu items that are direct children of the menu element,
	 * not menu items that are nested in submenus.
	 * @param element The menu item element
	 */
	function getMenuItems(menuElement: HTMLElement) {
		return Array.from(
			menuElement.querySelectorAll(`[role="menuitem"][data-melt-menu-id="${menuElement.id}"]`)
		) as HTMLElement[];
	}

	return {
		trigger: rootTrigger,
		menu: rootMenu,
		open: rootOpen,
		item,
		arrow: rootArrow,
		options: rootOptions,
		createSubMenu,
	};
}

type Point = { x: number; y: number };
type Polygon = Point[];
type Side = 'left' | 'right';
type GraceIntent = { area: Polygon; side: Side };

// Determine if a point is inside of a polygon.
// Based on https://github.com/substack/point-in-polygon
function isPointInPolygon(point: Point, polygon: Polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;

		// prettier-ignore
		const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
}

function isPointerInGraceArea(event: PointerEvent, area?: Polygon) {
	if (!area) return false;
	const cursorPos = { x: event.clientX, y: event.clientY };
	return isPointInPolygon(cursorPos, area);
}
