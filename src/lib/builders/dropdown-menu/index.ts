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
	omit,
	sleep,
	styleToString,
	uuid,
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
	required?: boolean;
	disabled?: boolean;
	selected?: string | number;
	name?: string;
};

const defaults = {
	arrowSize: 8,
	required: false,
	disabled: false,
	positioning: {
		placement: 'bottom',
	},
} satisfies Defaults<CreateDropdownMenuArgs>;

export function createDropdownMenu(args?: CreateDropdownMenuArgs) {
	const withDefaults = { ...defaults, ...args } as CreateDropdownMenuArgs;
	const rootOptions = writable(omit(withDefaults, 'selected'));

	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);

	const lastPointerX = writable(0);
	const isUsingKeyboard = writable(false);
	const pointerGraceIntent = writable<GraceIntent | null>(null);
	const pointerDir = writable<Side>('right');

	const isPointerMovingToSubmenu = derivedWithUnsubscribe(
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
						clickOutside: {
							ignore: (event) => {
								const target = event.target as HTMLElement;
								if (target.closest(`[data-melt-part="menu-sub"]`)) {
									return true;
								}
								return false;
							},
						},
						focusTrap: null,
					},
				});

				attach('keydown', (event) => {
					// submenu key events bubble through portals, we only care about
					// keys in the root menu
					const target = event.target as HTMLElement;
					const isKeyDownInside = target.closest('[data-melt-menu]') === event.currentTarget;

					const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
					const isCharacterKey = event.key.length === 1;
					if (!isKeyDownInside) return;

					// menus should not be navigated using tab so we prevent it
					// reference: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					if (event.key === 'Tab') event.preventDefault();

					if (!isModifierKey && isCharacterKey) {
						// typeahead logic
					}

					// focus first/last item based on key
					if (!FIRST_LAST_KEYS.includes(event.key)) return;
					handleMenuNavigation(event);
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
				const triggerElement = event.currentTarget as HTMLElement;
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
				const triggerElement = event.currentTarget as HTMLElement;
				if (SELECTION_KEYS.includes(event.key)) {
					rootOpen.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							rootActiveTrigger.set(triggerElement);
						} else {
							rootActiveTrigger.set(null);
						}

						return isOpen;
					});
				}

				if (event.key === kbd.ARROW_DOWN) {
					rootOpen.update(() => {
						rootActiveTrigger.set(triggerElement);
						return true;
					});
				}
				event.preventDefault();
			});

			return {
				'aria-controls': rootIds.menu,
				'aria-expanded': $rootOpen,
				'aria-required': $rootOptions.required,
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

	const rootItem = elementMultiDerived([], (_, { attach, getElement }) => {
		return () => {
			getElement().then((element) => setMeltMenuAttribute(element));

			attach('keydown', (event) => {
				if (SELECTION_KEYS.includes(event.key)) {
					(event.currentTarget as HTMLElement).click();
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
		const subOptions = writable(omit(withDefaults, 'selected'));

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
			([$subOpen, $activeTrigger, $subOptions], { addAction, attach }) => {
				if ($subOpen && $activeTrigger) {
					const parentMenuEl = getParentMenu($activeTrigger) as HTMLElement | undefined;

					addAction(usePopper, {
						anchorElement: $activeTrigger,
						open: subOpen,
						options: {
							floating: $subOptions.positioning,
							clickOutside: null,
							portal: parentMenuEl ? parentMenuEl : undefined,
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
					const target = event.target as HTMLElement;
					const currentTarget = event.currentTarget as HTMLElement;
					const targetMeltMenuId = target.getAttribute('data-melt-menu-id');
					const isKeyDownInside =
						target.closest('[data-melt-menu]') === event.currentTarget &&
						targetMeltMenuId === currentTarget.id;

					const isCloseKey = SUB_CLOSE_KEYS['ltr'].includes(event.key);
					const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
					const isCharacterKey = event.key.length === 1;

					if (!isKeyDownInside) return;

					if (FIRST_LAST_KEYS.includes(event.key)) {
						event.stopImmediatePropagation();
					}
					if (isCloseKey) {
						event.preventDefault();
						subOpen.update(() => {
							$activeTrigger?.focus();
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

					// focus first/last item based on key
					if (!FIRST_LAST_KEYS.includes(event.key)) return;
					handleMenuNavigation(event);
				});

				attach('pointermove', (event) => {
					onMenuPointerMove(event);
				});

				attach('focusout', (event) => {
					if (get(isUsingKeyboard)) {
						const submenuElement = document.getElementById(subIds.menu);
						if (
							!submenuElement?.contains(event.target as HTMLElement) &&
							event.target !== $activeTrigger
						) {
							subOpen.set(false);
							subActiveTrigger.set(null);
						}
					} else {
						const menuElement = event.currentTarget as HTMLElement;
						const relatedTarget = event.relatedTarget as HTMLElement;
						if (!menuElement.contains(relatedTarget) && relatedTarget !== $activeTrigger) {
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
					const triggerElement = event.currentTarget as HTMLElement;
					triggerElement.focus();
					if (!get(subOpen)) {
						subOpen.update((prev) => {
							const isAlreadyOpen = prev;
							if (!isAlreadyOpen) {
								subActiveTrigger.set(triggerElement);
								return !prev;
							}
							return prev;
						});
					}
				});

				attach('keydown', (event) => {
					if (SUB_OPEN_KEYS['ltr'].includes(event.key)) {
						const triggerElement = event.currentTarget as HTMLElement;

						if (!$subOpen) {
							triggerElement.click();
							event.preventDefault();
							return;
						}

						const menuId = triggerElement.getAttribute('aria-controls');
						if (!menuId) return;
						const menuElement = document.getElementById(menuId);
						if (!menuElement) return;

						const firstItem = getMenuItems(menuElement)[0];
						firstItem.focus();
					}
					return;
				});

				attach('pointermove', (event) => {
					if (event.pointerType !== 'mouse') {
						return undefined;
					}
					onItemEnter(event);
					if (event.defaultPrevented) return;
					(event.currentTarget as HTMLElement).focus();

					const triggerEl = event.currentTarget as HTMLElement;
					const openTimer = get(subOpenTimer);
					if (!$subOpen && !openTimer) {
						subOpenTimer.set(
							window.setTimeout(() => {
								subOpen.update(() => {
									subActiveTrigger.set(triggerEl);
									return true;
								});
								clearOpenTimer(subOpenTimer);
							}, 100)
						);
					}
				});

				attach('pointerleave', (event) => {
					if (event.pointerType !== 'mouse') return undefined;
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
					const target = event.target as HTMLElement;
					const relatedTarget = event.relatedTarget as HTMLElement | null;
					if (!relatedTarget) return;
					const menuId = target.getAttribute('aria-controls');
					if (!menuId) return;
					const menu = document.getElementById(menuId);

					if (menu && !menu.contains(relatedTarget)) {
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
					'aria-required': $subOptions.required,
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
				subOpen.set(false);
				subActiveTrigger.set(null);
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
			if (menuElement && $subOpen && get(isUsingKeyboard)) {
				// Selector to get menu items belonging to menu
				const rootMenuItemSelector = `[role="menuitem"][data-melt-menu-id="${menuElement.id}"]`;

				// Focus on first menu item
				const firstOption = document.querySelector(rootMenuItemSelector) as HTMLElement | undefined;
				sleep(1).then(() => (firstOption ? firstOption.focus() : undefined));
			} else if (!$subOpen && $subActiveTrigger && isBrowser) {
				sleep(1).then(() => $subActiveTrigger.focus());
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
		const menuElement = document.getElementById(rootIds.menu);
		if (menuElement && $rootOpen) {
			sleep(1).then(() => menuElement.focus());
		}
		if (!$rootOpen && $rootActiveTrigger) {
			$rootActiveTrigger?.focus();
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
					rootActiveTrigger.set(null);
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
			sleep(1).then(() => $rootActiveTrigger.focus());
		}
	});

	/* -------------------------------------------------------------------------------------------------
	 * Pointer Event Effects
	 * -----------------------------------------------------------------------------------------------*/

	function clearOpenTimer(openTimer: Writable<number | null>) {
		if (!isBrowser) return;
		const timer = get(openTimer);
		if (timer) {
			window.clearTimeout(timer);
			openTimer.set(null);
		}
	}

	function onItemEnter(event: PointerEvent) {
		if (get(isPointerMovingToSubmenu)(event)) {
			event.preventDefault();
		}
	}

	function onItemLeave(event: PointerEvent) {
		if (get(isPointerMovingToSubmenu)(event)) {
			return;
		}
		const menuEl = (event.target as HTMLElement).closest('[role="menu"]') as HTMLElement | null;
		if (!menuEl) return;
		menuEl.focus();
	}

	function onTriggerLeave(event: PointerEvent) {
		if (get(isPointerMovingToSubmenu)(event)) {
			event.preventDefault();
		}
	}

	function onMenuPointerMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		const target = event.target as HTMLElement;

		const $lastPointerX = get(lastPointerX);

		const pointerXHasChanged = $lastPointerX !== event.clientX;

		// We don't use `event.movementX` for this check because Safari will
		// always return `0` on a pointer event.
		if ((event.currentTarget as HTMLElement).contains(target) && pointerXHasChanged) {
			const newDir = event.clientX > $lastPointerX ? 'right' : 'left';
			pointerDir.set(newDir);
			lastPointerX.set(event.clientX);
		}
	}

	function onMenuItemPointerMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		onItemEnter(event);
		if (!event.defaultPrevented) {
			(event.currentTarget as HTMLElement).focus();
		}
	}

	function onMenuItemPointerLeave(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		onItemLeave(event);
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	function handleMenuNavigation(event: KeyboardEvent) {
		event.preventDefault();
		const currentItem = document.activeElement as HTMLElement;

		// menu items of the target menu
		const candidateNodes = getMenuItems(event.currentTarget as HTMLElement);

		// Get the index of the current item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentItem);

		// Calculate the index of the next item
		const nextIndex =
			event.key === 'ArrowUp'
				? currentIndex > 0
					? currentIndex - 1
					: 0
				: currentIndex < candidateNodes.length - 1
				? currentIndex + 1
				: currentIndex;

		// Focus the next item
		const nextItem = candidateNodes[nextIndex];
		sleep(1).then(() => nextItem.focus());
	}

	/**
	 * Get the parent menu element for a menu item.
	 * @param element The menu item element
	 */

	function getParentMenu(element: HTMLElement) {
		return element.closest('[role="menu"]');
	}

	function setMeltMenuAttribute(element: HTMLElement | null) {
		if (!element) return;
		const menuEl = element.closest(
			'[data-melt-part="menu-root"], [data-melt-part="menu-sub"]'
		) as HTMLElement | null;
		if (!menuEl) return;
		element.setAttribute('data-melt-menu-id', menuEl.id);
	}

	function getMenuItems(menuElement: HTMLElement) {
		return Array.from(
			menuElement.querySelectorAll(`[role="menuitem"][data-melt-menu-id="${menuElement.id}"]`)
		) as HTMLElement[];
	}

	return {
		trigger: rootTrigger,
		menu: rootMenu,
		open: rootOpen,
		item: rootItem,
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
