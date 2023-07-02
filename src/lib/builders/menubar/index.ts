import type { Defaults } from '$lib/internal/types';
import { derived, get, writable, type Writable } from 'svelte/store';
import {
	SELECTION_KEYS,
	applyAttrsIfDisabled,
	getMenuItems,
	createMenuBuilder,
	type Menu,
	setMeltMenuAttribute,
	FIRST_LAST_KEYS,
	handleMenuNavigation,
	handleTabNavigation,
	type MenuParts,
} from '../menu';
import {
	executeCallbacks,
	isHTMLElement,
	addEventListener,
	kbd,
	handleRovingFocus,
	effect,
	styleToString,
	noop,
	generateId,
	isBrowser,
	hiddenAction,
	getNextFocusable,
	getPreviousFocusable,
	builder,
	createElHelpers,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { usePopper } from '$lib/internal/actions';

export type CreateMenubar = {
	/**
	 * Whether or not the menubar should loop when
	 * navigating with the arrow keys.
	 *
	 * @default true
	 */
	loop?: boolean;
};
export type CreateMenu = Menu['builder'];
export type CreateSubMenu = Menu['submenu'];
export type MenuItem = Menu['item'];
export type MenuCheckboxItem = Menu['checkboxItem'];
export type CreateMenuRadioGroup = Menu['radioGroup'];
export type MenuRadioItem = Menu['radioItem'];
export type MenuRadioItemAction = Menu['radioItemAction'];

const MENUBAR_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];

const { name, selector } = createElHelpers<MenuParts | 'menu'>('menubar');

const defaults = {
	loop: true,
} satisfies Defaults<CreateMenubar>;

export function createMenubar(args?: CreateMenubar) {
	const withDefaults = { ...defaults, ...args } satisfies CreateMenubar;
	const activeMenu = writable<string>('');
	const scopedMenus = writable<HTMLElement[]>([]);
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const rootIds = {
		menubar: generateId(),
	};

	const menubar = builder(name(), {
		returned() {
			return {
				role: 'menubar',
				'data-melt-menubar': '',
				'data-orientation': 'horizontal',
				id: rootIds.menubar,
			};
		},
		action: (node: HTMLElement) => {
			const menuTriggers = node.querySelectorAll(
				'[data-melt-menubar-trigger]'
			) as unknown as HTMLElement[];
			if (menuTriggers.length === 0) return;
			menuTriggers[0].tabIndex = 0;

			const menus = Array.from(node.querySelectorAll('[data-melt-menubar-menu]')) as HTMLElement[];
			scopedMenus.set(menus);

			return {
				destroy: noop,
			};
		},
	});

	const menuDefaults = {
		positioning: {
			placement: 'bottom-start',
		},
		preventScroll: true,
	} satisfies Defaults<CreateMenu>;

	const createMenu = (args?: CreateMenu) => {
		const withDefaults = { ...menuDefaults, ...args } as CreateMenu;
		const rootOptions = writable(withDefaults);
		const rootOpen = writable(false);
		const rootActiveTrigger = writable<HTMLElement | null>(null);

		const m = createMenuBuilder({
			rootOptions,
			rootOpen,
			rootActiveTrigger,
			disableTriggerRefocus: true,
			disableFocusFirstItem: true,
			nextFocusable,
			prevFocusable,
			selector: 'menubar',
		});

		const menu = builder(name('menu'), {
			stores: [rootOpen],
			returned: ([$rootOpen]) => {
				return {
					role: 'menu',
					hidden: $rootOpen ? undefined : true,
					style: styleToString({
						display: $rootOpen ? undefined : 'none',
					}),
					id: m.rootIds.menu,
					'aria-labelledby': m.rootIds.trigger,
					'data-melt-menubar-menu': '',
					'data-melt-menu': '',
					'data-state': $rootOpen ? 'open' : 'closed',
					'data-melt-scope': rootIds.menubar,
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
								const popper = usePopper(node, {
									anchorElement: $rootActiveTrigger,
									open: rootOpen,
									options: {
										floating: $rootOptions.positioning,
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
						'isKeyDownInside', isKeyDownInside;
						if (!isKeyDownInside) return;
						if (FIRST_LAST_KEYS.includes(e.key)) {
							handleMenuNavigation(e);
						}

						if (MENUBAR_NAV_KEYS.includes(e.key)) {
							handleCrossMenuNavigation(e, activeMenu);
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
						}

						/**
						 * Check for typeahead search and handle it.
						 */
						const isCharacterKey = e.key.length === 1;
						const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
						if (!isModifierKey && isCharacterKey) {
							m.handleTypeaheadSearch(e.key, getMenuItems(menuElement));
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
			stores: [rootOpen],
			returned: ([$rootOpen]) => {
				return {
					'aria-controls': m.rootIds.menu,
					'aria-expanded': $rootOpen,
					'data-state': $rootOpen ? 'open' : 'closed',
					id: m.rootIds.trigger,
					'data-melt-menubar-trigger': '',
					'aria-haspopup': 'menu',
					'data-orientation': 'horizontal',
					role: 'menuitem',
				} as const;
			},
			action: (node: HTMLElement) => {
				applyAttrsIfDisabled(node);

				const menubarElement = document.getElementById(rootIds.menubar);
				if (!menubarElement) return;

				const menubarTriggers = Array.from(
					menubarElement.querySelectorAll<HTMLElement>('[data-melt-menubar-trigger]')
				);
				if (!menubarTriggers.length) return;
				if (menubarTriggers[0] === node) {
					node.tabIndex = 0;
				} else {
					node.tabIndex = -1;
				}

				const unsub = executeCallbacks(
					addEventListener(node, 'pointerdown', (e) => {
						if (e.button !== 0 || e.ctrlKey === true) return;

						const $rootOpen = get(rootOpen);
						const triggerElement = e.currentTarget;
						if (!isHTMLElement(triggerElement)) return;

						rootOpen.update((prev) => {
							const isOpen = !prev;
							if (isOpen) {
								nextFocusable.set(getNextFocusable(triggerElement));
								prevFocusable.set(getPreviousFocusable(triggerElement));
								rootActiveTrigger.set(triggerElement);
								activeMenu.set(m.rootIds.menu);
							} else {
								rootActiveTrigger.set(null);
								activeMenu.set('');
							}

							return isOpen;
						});
						if (!$rootOpen) e.preventDefault();
					}),
					addEventListener(node, 'keydown', (e) => {
						const triggerElement = e.currentTarget;
						if (!isHTMLElement(triggerElement)) return;

						if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN) {
							if (e.key === kbd.ARROW_DOWN) {
								/**
								 * We don't want to scroll the page when the user presses the
								 * down arrow when focused on the trigger, so we prevent that
								 * default behavior.
								 */
								e.preventDefault();
							}
							rootOpen.update((prev) => {
								const isOpen = !prev;
								if (isOpen) {
									nextFocusable.set(getNextFocusable(triggerElement));
									prevFocusable.set(getPreviousFocusable(triggerElement));
									rootActiveTrigger.set(triggerElement);
									activeMenu.set(m.rootIds.menu);
								} else {
									rootActiveTrigger.set(null);
									activeMenu.set('');
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
					}),
					addEventListener(node, 'pointerenter', (e) => {
						const triggerElement = e.currentTarget;
						if (!isHTMLElement(triggerElement)) return;

						const $activeMenu = get(activeMenu);
						const $rootOpen = get(rootOpen);
						if ($activeMenu && !$rootOpen) {
							rootOpen.set(true);
							activeMenu.set(m.rootIds.menu);
							rootActiveTrigger.set(triggerElement);
						}
					})
				);

				return {
					destroy: unsub,
				};
			},
		});

		effect([activeMenu], ([$activeMenu]) => {
			if (!isBrowser) return;
			if ($activeMenu === m.rootIds.menu) {
				if (get(rootOpen)) return;

				const triggerElement = document.getElementById(m.rootIds.trigger);
				if (!isHTMLElement(triggerElement)) return;
				rootActiveTrigger.set(triggerElement);
				triggerElement.setAttribute('data-highlighted', '');
				rootOpen.set(true);
				return;
			}

			if ($activeMenu !== m.rootIds.menu) {
				if (!isBrowser) return;
				if (get(rootOpen)) {
					const triggerElement = document.getElementById(m.rootIds.trigger);
					if (!isHTMLElement(triggerElement)) return;
					triggerElement.removeAttribute('data-highlighted');
					rootActiveTrigger.set(null);
					rootOpen.set(false);
				}
				return;
			}
		});

		effect([rootOpen], ([$rootOpen]) => {
			if (!isBrowser) return;
			const triggerElement = document.getElementById(m.rootIds.trigger);
			if (!$rootOpen && get(activeMenu) === m.rootIds.menu) {
				activeMenu.set('');
				triggerElement?.removeAttribute('data-highlighted');
				return;
			}
			if ($rootOpen) {
				triggerElement?.setAttribute('data-highlighted', '');
			}
		});

		return {
			menu,
			trigger,
			item: m.item,
			checkboxItem: m.checkboxItem,
			arrow: m.arrow,
			createSubmenu: m.createSubMenu,
			createMenuRadioGroup: m.createMenuRadioGroup,
			separator: m.separator,
		};
	};

	onMount(() => {
		if (!isBrowser) return;

		const menubarElement = document.getElementById(rootIds.menubar);
		if (!isHTMLElement(menubarElement)) return;

		const unsubEvents = executeCallbacks(
			addEventListener(menubarElement, 'keydown', (e) => {
				const target = e.target;
				if (!isHTMLElement(target)) return;

				const menuElement = e.currentTarget;
				if (!isHTMLElement(menuElement)) return;
				/**
				 * Submenu key events bubble through portals and
				 * we only care about key events that happen inside this menu.
				 */
				const isTargetTrigger = target.hasAttribute('data-melt-menubar-trigger');

				if (!isTargetTrigger) return;

				if (MENUBAR_NAV_KEYS.includes(e.key)) {
					handleMenubarNavigation(e);
				}
			}),
			addEventListener(document, 'keydown', (e) => {
				if (e.key === kbd.ESCAPE) {
					activeMenu.set('');
				}
			})
		);

		return () => {
			unsubEvents();
		};
	});

	/**
	 * Keyboard event handler for menu navigation
	 * @param e The keyboard event
	 */
	function handleCrossMenuNavigation(e: KeyboardEvent, activeMenu: Writable<string>) {
		if (!isBrowser) return;
		e.preventDefault();

		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		const target = e.target;
		if (!isHTMLElement(target)) return;

		const targetIsSubTrigger = target.hasAttribute('data-melt-menu-subtrigger');
		const isKeyDownInsideSubMenu = target.closest('[data-melt-menu]') !== currentTarget;

		const prevMenuKey = kbd.ARROW_LEFT;
		const isPrevKey = e.key === prevMenuKey;
		const isNextKey = !isPrevKey;

		// prevent navigation when opening a submenu
		if (isNextKey && targetIsSubTrigger) return;
		// prevent navigation when closing a submenu
		if (isPrevKey && isKeyDownInsideSubMenu) return;

		// menus scoped to the menubar
		const childMenus = get(scopedMenus);
		if (!childMenus.length) return;
		// Index of the currently focused item in the candidate nodes array
		const currentIndex = childMenus.indexOf(currentTarget);
		// Calculate the index of the next menu item
		let nextIndex: number;
		switch (e.key) {
			case kbd.ARROW_RIGHT:
				nextIndex = currentIndex < childMenus.length - 1 ? currentIndex + 1 : 0;
				break;
			case kbd.ARROW_LEFT:
				nextIndex = currentIndex > 0 ? currentIndex - 1 : childMenus.length - 1;
				break;
			case kbd.HOME:
				nextIndex = 0;
				break;
			case kbd.END:
				nextIndex = childMenus.length - 1;
				break;
			default:
				return;
		}

		const nextFocusedItem = childMenus[nextIndex];
		activeMenu.set(nextFocusedItem.id);
	}

	function getMenuTriggers(element: HTMLElement) {
		const menuElement = element.closest('[role="menubar"]');
		if (!isHTMLElement(menuElement)) return [];
		return Array.from(menuElement.querySelectorAll('[data-melt-menubar-trigger]'));
	}

	/**
	 * Keyboard event handler for menubar navigation.
	 * @param e The keyboard event
	 */
	function handleMenubarNavigation(e: KeyboardEvent) {
		e.preventDefault();

		// currently focused menu item
		const currentFocusedItem = document.activeElement;
		if (!isHTMLElement(currentFocusedItem)) return;

		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		// menu items of the current menu
		const menuTriggers = getMenuTriggers(currentTarget);
		if (!menuTriggers.length) return;

		const candidateNodes = menuTriggers.filter((item) => {
			if (item.hasAttribute('data-disabled')) {
				return false;
			}
			if (item.getAttribute('disabled') === 'true') {
				return false;
			}
			return true;
		}) as HTMLElement[];

		// Index of the currently focused item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);

		// Calculate the index of the next menu item
		let nextIndex: number;
		const loop = withDefaults.loop;
		switch (e.key) {
			case kbd.ARROW_RIGHT:
				nextIndex =
					currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : loop ? 0 : currentIndex;
				break;
			case kbd.ARROW_LEFT:
				nextIndex = currentIndex > 0 ? currentIndex - 1 : loop ? candidateNodes.length - 1 : 0;
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

	return {
		menubar,
		createMenu,
	};
}
