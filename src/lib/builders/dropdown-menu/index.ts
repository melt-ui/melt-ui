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

	// The currently open submenu ids
	const openSubMenus = writable<string[]>([]);

	const rootIds = {
		menu: uuid(),
		trigger: uuid(),
	};

	const rootMenu = elementDerived(
		[rootOpen, rootActiveTrigger, rootOptions],
		([$rootOpen, $rootActiveTrigger, $rootOptions], { addAction }) => {
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
			};
		}
	);

	const rootTrigger = elementDerived(
		[rootOpen, rootOptions],
		([$rootOpen, $rootOptions], { attach }) => {
			attach('click', (e) => {
				const triggerEl = e.currentTarget as HTMLElement;
				rootOpen.update((prev) => {
					const isOpen = !prev;
					if (isOpen) {
						rootActiveTrigger.set(triggerEl);
					} else {
						rootActiveTrigger.set(null);
					}

					return isOpen;
				});
			});

			attach('keydown', (e) => {
				const triggerEl = e.currentTarget as HTMLElement;
				if (e.key === kbd.ARROW_DOWN) {
					rootOpen.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							rootActiveTrigger.set(triggerEl);
						} else {
							rootActiveTrigger.set(null);
						}

						return isOpen;
					});
				}
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

			attach('keydown', (event) => onMenuItemKeydown(event));

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

				attach('pointermove', (event) => {
					onMenuPointerMove(event);
				});

				attach('focusout', (event) => {
					event.preventDefault();

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
					const triggerEl = event.currentTarget as HTMLElement;
					triggerEl.focus();
					if (!get(subOpen)) {
						subOpen.update((prev) => {
							const isAlreadyOpen = prev;
							if (!isAlreadyOpen) {
								subActiveTrigger.set(triggerEl);
								return !prev;
							}
							return prev;
						});
					}
				});

				attach('keydown', (event) => onSubTriggerKeydown(event, subOpen, subActiveTrigger));

				attach('pointermove', (event) => {
					if (event.pointerType !== 'mouse') {
						return undefined;
					}
					onItemEnter(event);
					if (event.defaultPrevented) return;

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

		const subItem = elementMultiDerived([], (_, { attach, getElement }) => {
			return () => {
				getElement().then((element) => setMeltMenuAttribute(element));

				attach('keydown', (event) => onMenuItemKeydown(event));

				attach('pointermove', (event) => {
					onMenuItemPointerMove(event);
				});

				attach('pointerleave', (event) => {
					onMenuItemPointerLeave(event);
				});

				// attach('blur', (event) => {
				// 	const menuElement = document.getElementById(subIds.menu);
				// 	if (!menuElement) return;
				// 	const hasFocusedSubmenuItem = menuElement.matches(':focus-within');
				// 	const relatedTarget = event.relatedTarget as HTMLElement | null;

				// 	if (!hasFocusedSubmenuItem && relatedTarget?.id !== subIds.trigger) {
				// 		subOpen.set(false);
				// 		subActiveTrigger.set(null);
				// 	}
				// });

				return {
					role: 'menuitem',
					tabindex: -1,
				};
			};
		});

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
				openSubMenus.set([]);
			}
		});

		effect([pointerGraceIntent], ([$pointerGraceIntent]) => {
			if (!isBrowser) return;
			if (!$pointerGraceIntent) {
				window.clearTimeout(get(pointerGraceTimer));
			}
		});

		effect([openSubMenus], ([$openSubMenus]) => {
			const currentSubIndex = $openSubMenus.indexOf(subIds.menu);
			if ($openSubMenus.length === 0) {
				subOpen.set(false);
				subActiveTrigger.set(null);
				return;
			}

			if (currentSubIndex === -1) {
				subOpen.set(false);
				subActiveTrigger.set(null);
				return;
			}
		});

		effect([subOpen], ([$subOpen]) => {
			if ($subOpen) {
				// if the submenu is open, add it to the open submenus
				openSubMenus.update((prev) => [...prev, subIds.menu]);
			}
			if (!$subOpen) {
				// if the submenu is closed, remove it from the open submenus
				openSubMenus.update((prev) => prev.filter((id) => id !== subIds.menu));
			}
		});

		effect([subOpen, subMenu, subActiveTrigger], ([$subOpen, $subMenu, $subActiveTrigger]) => {
			if (!isBrowser) return;
			const menuElement = getElementByMeltId($subMenu['data-melt-id']);
			if (menuElement && $subOpen && get(isUsingKeyboard)) {
				// Selector to get menu items belonging to menu
				const rootMenuItemSelector = `[role="menuitem"][data-melt-menu="${menuElement.id}"]`;

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
			subItem,
		};
	};

	/* -------------------------------------------------------------------------------------------------
	 * Root Effects
	 * -----------------------------------------------------------------------------------------------*/

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

			// Selector to get menu items belonging to menu
			const rootMenuItemSelector = `[role="menuitem"][data-melt-menu="${menuElement.id}"]`;

			// Focus on first menu item
			const firstOption = document.querySelector(rootMenuItemSelector) as HTMLElement | undefined;
			sleep(1).then(() => (firstOption ? firstOption.focus() : undefined));

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
	 * Keyboard Navigation
	 * -----------------------------------------------------------------------------------------------*/

	function onMenuItemKeydown(event: KeyboardEvent) {
		const target = event.currentTarget as HTMLElement;

		if (event.key === kbd.SPACE || FIRST_LAST_KEYS.includes(event.key)) event.preventDefault();

		const nav = getMenuItemNav(target);
		if (!nav) return;

		const { next, prev } = nav;

		if (event.key === kbd.ARROW_DOWN) {
			return next ? next.focus() : undefined;
		}
		if (event.key === kbd.ARROW_UP) {
			return prev ? prev.focus() : undefined;
		}
		if (SUB_CLOSE_KEYS['ltr'].includes(event.key)) {
			handleCloseSubmenu(target);
		}
	}

	function onSubTriggerKeydown(
		event: KeyboardEvent,
		open: Writable<boolean>,
		activeTrigger: Writable<HTMLElement | null>
	) {
		const target = event.currentTarget as HTMLElement;

		if (FIRST_LAST_KEYS.includes(event.key)) event.preventDefault();

		const nav = getMenuItemNav(target);
		if (!nav) return;

		const { next, prev } = nav;

		if (event.key === kbd.ARROW_DOWN) {
			return next ? next.focus() : undefined;
		}
		if (event.key === kbd.ARROW_UP) {
			return prev ? prev.focus() : undefined;
		}

		if (SUB_OPEN_KEYS['ltr'].includes(event.key)) {
			event.preventDefault();
			open.update((prev) => {
				const isOpen = !prev;
				if (isOpen) {
					activeTrigger.set(target);
					return isOpen;
				}
				return prev;
			});

			const submenuId = target.getAttribute('aria-controls');
			if (!submenuId) return;

			const submenu = document.getElementById(submenuId);
			if (!submenu) return;

			submenu.focus();
		}

		if (SUB_CLOSE_KEYS['ltr'].includes(event.key)) {
			return handleCloseSubmenu(target);
		}
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	/**
	 * Get the parent menu element for a menu item.
	 * @param element The menu item element
	 */

	function getParentMenu(element: HTMLElement) {
		return element.closest('[role="menu"]');
	}

	function handleCloseSubmenu(element: HTMLElement) {
		if (!isItemInSubmenu(element)) return;
		const menuId = element.getAttribute('data-melt-menu');
		if (!menuId) return;
		const previousTrigger = document.querySelector(`[aria-controls="${menuId}"]`) as
			| HTMLElement
			| undefined;
		openSubMenus.update((prev) => {
			const next = prev.filter((id) => id !== menuId);
			return next;
		});

		sleep(1).then(() => (previousTrigger ? previousTrigger.focus() : undefined));
	}

	function setMeltMenuAttribute(element: HTMLElement | null) {
		if (!element) return;
		const menuEl = element.closest(
			'[data-melt-part="menu-root"], [data-melt-part="menu-sub"]'
		) as HTMLElement | null;
		if (!menuEl) return;
		element.setAttribute('data-melt-menu', menuEl.id);
	}

	function isItemInSubmenu(element: HTMLElement) {
		const menuEl = getParentMenu(element);
		if (!menuEl) return false;

		return menuEl.getAttribute('data-melt-part') === 'menu-sub';
	}

	function getCurrentMenuItems(element: HTMLElement) {
		const menuEl = getParentMenu(element);
		if (!menuEl) return null;

		return Array.from(
			menuEl.querySelectorAll(`[role="menuitem"][data-melt-menu="${menuEl.id}"`)
		) as HTMLElement[];
	}

	function getMenuItemNav(element: HTMLElement) {
		const menuItems = getCurrentMenuItems(element);
		if (!menuItems) return null;

		const currentIndex = menuItems.indexOf(element);

		const next = currentIndex + 1 < menuItems.length ? menuItems[currentIndex + 1] : undefined;
		const prev = currentIndex - 1 >= 0 ? menuItems[currentIndex - 1] : undefined;

		return {
			next,
			prev,
		};
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
