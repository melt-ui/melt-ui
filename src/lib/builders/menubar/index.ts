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
	sleep,
	hiddenAction,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { usePopper } from '$lib/internal/actions';

export type MenubarArgs = Menu['builder'];
export type MenubarSubArgs = Menu['submenu'];
export type MenubarItemArgs = Menu['item'];
export type MenubarCheckboxItemArgs = Menu['checkboxItem'];
export type MenubarRadioGroup = Menu['radioGroup'];
export type MenubarRadioItemArgs = Menu['radioItem'];
export type MenubarRadioItemActionArgs = Menu['radioItemAction'];

const MENUBAR_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom-start',
	},
} satisfies Defaults<MenubarArgs>;

export function createMenubar() {
	const activeMenu = writable<string>('');
	const menubarMenus = writable<HTMLElement[]>([]);

	const menubarIds = {
		menubar: generateId(),
	};

	const menubar = hiddenAction({
		role: 'menubar',
		'data-melt-menubar': '',
		'data-orientation': 'horizontal',
		id: menubarIds.menubar,
		action: (node: HTMLElement) => {
			const menuTriggers = node.querySelectorAll(
				'[data-melt-menubar-trigger]'
			) as unknown as HTMLElement[];
			if (menuTriggers.length === 0) return;
			for (let i = 0; i < menuTriggers.length; i++) {
				if (!isHTMLElement(menuTriggers[i])) return;
				if (i === 0) {
					menuTriggers[i].tabIndex = 0;
				} else {
					menuTriggers[i].tabIndex = -1;
				}
			}

			const menus = Array.from(node.querySelectorAll('[data-melt-menubar-menu]')) as HTMLElement[];
			menubarMenus.set(menus);

			return {
				destroy: noop,
			};
		},
	});

	const createMenu = (args?: MenubarArgs) => {
		const withDefaults = { ...defaults, ...args } as MenubarArgs;
		const rootOptions = writable(withDefaults);
		const rootOpen = writable(false);
		const rootActiveTrigger = writable<HTMLElement | null>(null);

		const m = createMenuBuilder({
			rootOptions,
			rootOpen,
			rootActiveTrigger,
			disableTriggerRefocus: true,
		});

		const menu = {
			...derived([rootOpen], ([$rootOpen]) => {
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
					'data-melt-scope': menubarIds.menubar,
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
						if (!isKeyDownInside) return;
						if (FIRST_LAST_KEYS.includes(e.key)) {
							handleMenuNavigation(e);
						}

						if (e.key === kbd.ARROW_LEFT || e.key === kbd.ARROW_RIGHT) {
							handleCrossMenuNavigation(e, activeMenu);
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
		};

		const trigger = {
			...derived([rootOpen], ([$rootOpen]) => {
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
			}),
			action: (node: HTMLElement) => {
				applyAttrsIfDisabled(node);
				const unsub = executeCallbacks(
					addEventListener(node, 'pointerdown', (e) => {
						if (e.button !== 0 || e.ctrlKey === true) return;

						const $rootOpen = get(rootOpen);
						const triggerElement = e.currentTarget;
						if (!isHTMLElement(triggerElement)) return;

						rootOpen.update((prev) => {
							const isOpen = !prev;
							if (isOpen) {
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

						e.preventDefault();
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
		};

		effect([activeMenu], ([$activeMenu]) => {
			if ($activeMenu === m.rootIds.menu) {
				if (get(rootOpen)) return;

				const triggerElement = document.getElementById(m.rootIds.trigger);
				if (!isHTMLElement(triggerElement)) return;
				rootActiveTrigger.set(triggerElement);
				rootOpen.set(true);
				return;
			}

			if ($activeMenu !== m.rootIds.menu) {
				if (get(rootOpen)) {
					rootActiveTrigger.set(null);
					rootOpen.set(false);
				}
				return;
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

		const menubarElement = document.getElementById(menubar.id);
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

				if (e.shiftKey && e.key === kbd.TAB) {
					e.preventDefault();
					const focusableElements = getFocusableElements();
					const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
					const previousIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
					const previousElement = focusableElements[previousIndex];
					sleep(1).then(() => {
						previousElement.focus();
					});
				}

				if (e.key === kbd.TAB) {
					e.preventDefault();
					const focusableElements = getFocusableElements();
					const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
					const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
					const nextElement = focusableElements[nextIndex];
					nextElement.focus();
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
		const childMenus = get(menubarMenus);
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
			default:
				return;
		}

		const nextFocusedItem = childMenus[nextIndex];
		activeMenu.set(nextFocusedItem.id);
	}

	function getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
		const focusableElements = Array.from(
			container.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
			)
		);

		const focusableElementsWithoutTabindex = focusableElements.filter((element) => {
			const tabindex = element.getAttribute('tabindex');
			return tabindex !== '-1';
		});

		return focusableElementsWithoutTabindex;
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
		switch (e.key) {
			case kbd.ARROW_RIGHT:
				nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : currentIndex;
				break;
			case kbd.ARROW_LEFT:
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
	 * Keyboard event handler for menu navigation
	 * @param e The keyboard event
	 */
	function handleMenuNavigation(e: KeyboardEvent) {
		e.preventDefault();

		// currently focused menu item
		const currentFocusedItem = document.activeElement;
		if (!isHTMLElement(currentFocusedItem)) return;

		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		// menu items of the current menu
		const menuItems = getMenuItems(currentTarget);
		if (!menuItems.length) return;

		const candidateNodes = menuItems.filter((item) => {
			if (item.hasAttribute('data-disabled')) {
				return false;
			}
			if (item.getAttribute('disabled') === 'true') {
				return false;
			}
			return true;
		});

		// Index of the currently focused item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);

		// Calculate the index of the next menu item
		let nextIndex: number;
		switch (e.key) {
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

	return {
		menubar,
		createMenu,
	};
}
