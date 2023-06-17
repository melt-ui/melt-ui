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
import type { PointerEventHandler } from 'svelte/elements';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

type Direction = 'ltr' | 'rtl';

type Point = { x: number; y: number };
type Polygon = Point[];
type Side = 'left' | 'right';
type GraceIntent = { area: Polygon; side: Side };

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
							ignore: (e) => {
								const target = e.target as HTMLElement;
								if (target.closest(`[data-melt-part="menu-sub"]`)) {
									return true;
								}
								return false;
							},
						},
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
			getElement().then((el) => setMeltMenuAttribute(el));

			attach('keydown', (e) => onMenuItemKeydown(e));

			attach('mousemove', (e) => {
				(e.currentTarget as HTMLElement).focus();
			});

			attach('mouseout', (e) => {
				(e.currentTarget as HTMLElement).blur();
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
			gutter: 0,
		},
	} satisfies Defaults<CreateDropdownMenuArgs>;

	const createSubMenu = (args?: CreateDropdownMenuArgs) => {
		const withDefaults = { ...subMenuDefaults, ...args } as CreateDropdownMenuArgs;
		const subOptions = writable(omit(withDefaults, 'selected'));

		const subOpen = writable(false);
		const subActiveTrigger = writable<HTMLElement | null>(null);

		// Grace period handling
		const timer = writable(0);
		const pointerGraceTimer = writable(0);
		const pointerGraceIntent = writable<GraceIntent | null>(null);
		const pointerDir = writable<Side>('right');
		const lastPointerX = writable(0);

		const isPointerMovingToSubmenu = derivedWithUnsubscribe(
			[pointerDir, pointerGraceIntent],
			([$pointerDir, $pointerGraceIntent]) => {
				return (event: PointerEvent) => {
					const isMovingTowards = $pointerDir === $pointerGraceIntent?.side;
					return isMovingTowards && isPointerInGraceArea(event, $pointerGraceIntent?.area);
				};
			}
		);

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
						},
					});
				}

				attach('blur', (e) => {
					if (!(e.currentTarget as HTMLElement).contains(e.target as HTMLElement)) {
						window.clearTimeout(get(timer));
					}
				});

				attach('pointermove', (e) => {
					if (e.pointerType === 'mouse') {
						const target = e.target as HTMLElement;
						const $lastPointerX = get(lastPointerX);
						const pointerXHasChanged = $lastPointerX !== e.clientX;

						if ((e.currentTarget as HTMLElement).contains(target) && pointerXHasChanged) {
							const newDir = e.clientX > $lastPointerX ? 'right' : 'left';
							pointerDir.set(newDir);
							lastPointerX.set(e.clientX);
						}
					}
					return undefined;
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
			([$subOpen, $subOptions], { attach, getElement }) => {
				getElement().then((el) => setMeltMenuAttribute(el));

				attach('click', (e) => {
					e.stopPropagation();
					e.preventDefault();
				});

				attach('keydown', (e) => onSubTriggerKeydown(e, subOpen, subActiveTrigger));

				attach('pointerover', (e) => {
					const triggerEl = e.currentTarget as HTMLElement;
					subOpen.update((prev) => {
						const isAlreadyOpen = prev;
						if (!isAlreadyOpen) {
							subActiveTrigger.set(triggerEl);
							return !prev;
						}
						return prev;
					});
				});

				attach('pointermove', (e) => {
					if (e.pointerType === 'mouse') {
						const triggerEl = e.currentTarget as HTMLElement;
						const isMovingToSubmenu = get(isPointerMovingToSubmenu)(e);
						if (isMovingToSubmenu) {
							subOpen.update((prev) => {
								const isAlreadyOpen = prev;
								if (!isAlreadyOpen) {
									subActiveTrigger.set(triggerEl);
									return !prev;
								}
								return prev;
							});
						}
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
				getElement().then((el) => setMeltMenuAttribute(el));

				attach('keydown', (e) => onMenuItemKeydown(e));

				attach('mousemove', (e) => {
					(e.currentTarget as HTMLElement).focus();
				});

				attach('mouseout', (e) => {
					(e.currentTarget as HTMLElement).blur();
				});

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

		function onItemEnter(event: PointerEvent) {
			const pointerMovingToSubmenu = get(isPointerMovingToSubmenu)(event);
			if (pointerMovingToSubmenu) event.preventDefault();
		}

		function onItemLeave(event: PointerEvent) {
			const pointerMovingToSubmenu = get(isPointerMovingToSubmenu)(event);
			if (pointerMovingToSubmenu) return;
			const menuEl = (event.target as HTMLElement).closest('[role="menu"]') as HTMLElement | null;
			if (!menuEl) return;
			menuEl.focus();
		}

		function onTriggerLeave(event: PointerEvent) {
			const pointerMovingToSubmenu = get(isPointerMovingToSubmenu)(event);
			if (pointerMovingToSubmenu) event.preventDefault();
		}

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

		const menuEl = getElementByMeltId($rootMenu['data-melt-id']);
		if (menuEl && $rootOpen) {
			// Selector to get menu items belonging to menu
			const rootMenuItemSelector = `[role="menuitem"][data-melt-menu="${menuEl.id}"]`;

			// Focus on first menu item
			const firstOption = document.querySelector(rootMenuItemSelector) as HTMLElement | undefined;
			sleep(1).then(() => firstOption?.focus());

			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === kbd.ESCAPE) {
					rootOpen.set(false);
					rootActiveTrigger.set(null);
					return;
				}
			};
			document.addEventListener('keydown', keydownListener);
			return () => {
				document.removeEventListener('keydown', keydownListener);
			};
		} else if (!$rootOpen && $rootActiveTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $rootActiveTrigger.focus());
		}
	});

	/* -------------------------------------------------------------------------------------------------
	 * Grace Period Handling
	 * -----------------------------------------------------------------------------------------------*/

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

	/* -------------------------------------------------------------------------------------------------
	 * Keyboard Navigation
	 * -----------------------------------------------------------------------------------------------*/

	function onMenuItemKeydown(e: KeyboardEvent) {
		const target = e.currentTarget as HTMLElement;

		if (e.key === kbd.SPACE || FIRST_LAST_KEYS.includes(e.key)) e.preventDefault();

		const nav = getMenuItemNav(target);
		if (!nav) return;

		const { next, prev } = nav;

		if (e.key === kbd.ARROW_DOWN) {
			next?.focus();
		}
		if (e.key === kbd.ARROW_UP) {
			prev?.focus();
		}
		if (SUB_CLOSE_KEYS['ltr'].includes(e.key)) {
			handleCloseSubmenu(target);
		}
	}

	function onSubTriggerKeydown(
		e: KeyboardEvent,
		open: Writable<boolean>,
		activeTrigger: Writable<HTMLElement | null>
	) {
		const target = e.currentTarget as HTMLElement;

		if (FIRST_LAST_KEYS.includes(e.key)) e.preventDefault();

		const nav = getMenuItemNav(target);
		if (!nav) return;

		const { next, prev } = nav;

		if (e.key === kbd.ARROW_DOWN) {
			return next?.focus();
		}
		if (e.key === kbd.ARROW_UP) {
			return prev?.focus();
		}

		if (SUB_OPEN_KEYS['ltr'].includes(e.key)) {
			e.preventDefault();
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
			const menuItemsSelector = `[role="menuitem"][data-melt-menu="${submenuId}"]`;
			const firstOption = document.querySelector(menuItemsSelector) as HTMLElement | undefined;
			openSubMenus.update((prev) => {
				const openSubMenus = prev;
				if (openSubMenus.includes(submenuId)) return prev;
				return [...prev, submenuId];
			});
			sleep(1).then(() => firstOption?.focus());
			return;
		}

		if (SUB_CLOSE_KEYS['ltr'].includes(e.key)) {
			return handleCloseSubmenu(target);
		}
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	/**
	 * Get the parent menu element for a menu item.
	 * @param itemEl
	 */

	function getParentMenu(itemEl: HTMLElement) {
		return itemEl.closest('[role="menu"]');
	}

	function handleCloseSubmenu(element: HTMLElement) {
		if (!isItemInSubmenu(element)) return;
		const menuId = element.getAttribute('data-melt-menu');
		if (!menuId) return;
		openSubMenus.update((prev) => {
			const next = prev.filter((id) => id !== menuId);
			return next;
		});
		const previousTrigger = document.querySelector(`[aria-controls="${menuId}"]`) as
			| HTMLElement
			| undefined;
		sleep(1).then(() => previousTrigger?.focus());
	}

	function setMeltMenuAttribute(el: HTMLElement | null) {
		if (!el) return;
		const menuEl = el.closest(
			'[data-melt-part="menu-root"], [data-melt-part="menu-sub"]'
		) as HTMLElement | null;
		if (!menuEl) return;
		el.setAttribute('data-melt-menu', menuEl.id);
	}

	function isItemInSubmenu(itemEl: HTMLElement) {
		const menuEl = getParentMenu(itemEl);
		if (!menuEl) return false;

		return menuEl.getAttribute('data-melt-part') === 'menu-sub';
	}

	function getCurrentMenuItems(itemEl: HTMLElement) {
		const menuEl = getParentMenu(itemEl);
		if (!menuEl) return null;

		return Array.from(
			menuEl.querySelectorAll(`[role="menuitem"][data-melt-menu="${menuEl.id}"`)
		) as HTMLElement[];
	}

	function getMenuItemNav(itemEl: HTMLElement) {
		const menuItems = getCurrentMenuItems(itemEl);
		if (!menuItems) return null;

		const currentIndex = menuItems.indexOf(itemEl);

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
