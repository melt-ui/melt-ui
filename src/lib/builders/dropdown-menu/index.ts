import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
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
import { derived, writable, type Writable } from 'svelte/store';

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

/**
 * Features:
 * - [X] Click outside
 * - [X] Keyboard navigation
 * - [X] Focus management
 * - [ ] Detect overflow
 * - [ ] Same width as trigger
 * - [ ] A11y
 * - [X] Floating UI
 **/

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
				role: 'menu',
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

	const item = elementMultiDerived([], (_, { attach, getElement }) => {
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

		const subIds = {
			menu: uuid(),
			trigger: uuid(),
		};

		const subMenu = elementDerived(
			[subOpen, subActiveTrigger, subOptions],
			([$subOpen, $activeTrigger, $subOptions], { addAction, attach }) => {
				if ($subOpen && $activeTrigger) {
					addAction(usePopper, {
						anchorElement: $activeTrigger,
						open: subOpen,
						options: {
							floating: $subOptions.positioning,
							clickOutside: null,
						},
					});
				}

				attach('pointerenter', () => {
					// TODO: handle grace period
				});

				attach('pointerleave', () => {
					// TODO: handle grace period
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
						const isOpen = !prev;
						if (isOpen) {
							subActiveTrigger.set(triggerEl);
							return isOpen;
						} else {
							subActiveTrigger.set(null);
						}
						return isOpen;
					});
				});

				attach('pointerleave', () => {
					// TODO: handle grace period
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

		effect([rootOpen], ([$rootOpen]) => {
			if (!$rootOpen) {
				subOpen.set(false);
				subActiveTrigger.set(null);
				openSubMenus.set([]);
			}
		});

		effect([openSubMenus], ([$openSubMenus]) => {
			// If there are no submenus open, close the current submenu
			if ($openSubMenus.length === 0) {
				subOpen.set(false);
				subActiveTrigger.set(null);
				return;
			}

			// If the current sub menu is not in the open sub menus, close it
			if ($openSubMenus.indexOf(subIds.menu) === -1) {
				subOpen.set(false);
				subActiveTrigger.set(null);
				return;
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
		const menuId = itemEl.getAttribute('data-melt-menu');
		if (!menuId) return null;

		const menuEl = document.getElementById(menuId);
		if (!menuEl) return null;

		return menuEl;
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
		item,
		arrow: rootArrow,
		options: rootOptions,
		createSubMenu,
	};
}
