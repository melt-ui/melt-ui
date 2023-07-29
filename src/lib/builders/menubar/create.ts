import { get, writable, type Writable } from 'svelte/store';
import {
	applyAttrsIfDisabled,
	createMenuBuilder,
	getMenuItems,
	handleMenuNavigation,
	handleTabNavigation,
	type MenuParts,
} from '../menu';
import {
	executeCallbacks,
	isHTMLElement,
	addEventListener,
	kbd,
	SELECTION_KEYS,
	FIRST_LAST_KEYS,
	handleRovingFocus,
	effect,
	styleToString,
	noop,
	generateId,
	isBrowser,
	getNextFocusable,
	getPreviousFocusable,
	builder,
	createElHelpers,
	toWritableStores,
	removeHighlight,
	addHighlight,
	getPortalParent,
} from '$lib/internal/helpers';
import { onMount, tick } from 'svelte';
import { usePopper } from '$lib/internal/actions';
import type { CreateMenubarMenuProps, CreateMenubarProps } from './types';

const MENUBAR_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];

const { name } = createElHelpers<MenuParts | 'menu'>('menubar');

const defaults = {
	loop: true,
} satisfies CreateMenubarProps;

export function createMenubar(props?: CreateMenubarProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateMenubarProps;

	const options = toWritableStores(withDefaults);
	const { loop } = options;
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
			const menuTriggers = Array.from(node.querySelectorAll('[data-melt-menubar-trigger]'));
			if (!menuTriggers.length || !isHTMLElement(menuTriggers[0])) return;
			menuTriggers[0].tabIndex = 0;

			const menus = Array.from(node.querySelectorAll('[data-melt-menubar-menu]')).filter(
				(el): el is HTMLElement => isHTMLElement(el)
			);

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
		arrowSize: 8,
		dir: 'ltr',
		loop: false,
		closeOnEscape: true,
		closeOnOutsideClick: true,
		portal: 'body',
		forceVisible: false,
	} satisfies CreateMenubarMenuProps;

	const createMenu = (props?: CreateMenubarMenuProps) => {
		const withDefaults = { ...menuDefaults, ...props } satisfies CreateMenubarMenuProps;
		const rootOpen = writable(false);
		const rootActiveTrigger = writable<HTMLElement | null>(null);

		// options
		const options = toWritableStores(withDefaults);
		const { positioning } = options;

		const m = createMenuBuilder({
			rootOptions: options,
			rootOpen,
			rootActiveTrigger,
			disableTriggerRefocus: true,
			disableFocusFirstItem: true,
			nextFocusable,
			prevFocusable,
			selector: 'menubar-menu',
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
					'data-state': $rootOpen ? 'open' : 'closed',
					'data-melt-scope': rootIds.menubar,
					tabindex: -1,
				} as const;
			},
			action: (node: HTMLElement) => {
				/**
				 * We need to get the parent portal before the menu is opened,
				 * otherwise the parent will have been moved to the body, and
				 * will no longer be an ancestor of this node.
				 */
				const portalParent = getPortalParent(node);

				let unsubPopper = noop;

				const unsubDerived = effect(
					[rootOpen, rootActiveTrigger, positioning],
					([$rootOpen, $rootActiveTrigger, $positioning]) => {
						unsubPopper();
						if (!($rootOpen && $rootActiveTrigger)) return;

						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $rootActiveTrigger,
								open: rootOpen,
								options: {
									floating: $positioning,
									portal: portalParent,
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				);

				const unsubEvents = executeCallbacks(
					addEventListener(node, 'keydown', (e) => {
						const target = e.target;
						const menuEl = e.currentTarget;

						if (!isHTMLElement(menuEl) || !isHTMLElement(target)) return;

						if (MENUBAR_NAV_KEYS.includes(e.key)) {
							handleCrossMenuNavigation(e, activeMenu);
						}

						/**
						 * Submenu key events bubble through portals and
						 * we only care about key events that happen inside this menu.
						 */
						const isKeyDownInside = target.closest('[role="menu"]') === menuEl;

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
						}

						/**
						 * Check for typeahead search and handle it.
						 */
						const isCharacterKey = e.key.length === 1;
						const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
						if (!isModifierKey && isCharacterKey) {
							m.handleTypeaheadSearch(e.key, getMenuItems(menuEl));
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
					'aria-haspopup': 'menu',
					'data-orientation': 'horizontal',
					role: 'menuitem',
				} as const;
			},
			action: (node: HTMLElement) => {
				applyAttrsIfDisabled(node);

				const menubarEl = document.getElementById(rootIds.menubar);
				if (!menubarEl) return;

				const menubarTriggers = Array.from(
					menubarEl.querySelectorAll('[data-melt-menubar-trigger]')
				);
				if (!menubarTriggers.length) return;
				if (menubarTriggers[0] === node) {
					node.tabIndex = 0;
				} else {
					node.tabIndex = -1;
				}

				const unsub = executeCallbacks(
					addEventListener(node, 'click', (e) => {
						const $rootOpen = get(rootOpen);
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						handleOpen(triggerEl);
						if (!$rootOpen) e.preventDefault();
					}),
					addEventListener(node, 'keydown', (e) => {
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN) {
							e.preventDefault();
							handleOpen(triggerEl);

							const menuId = triggerEl.getAttribute('aria-controls');
							if (!menuId) return;

							const menu = document.getElementById(menuId);
							if (!menu) return;

							const menuItems = getMenuItems(menu);
							if (!menuItems.length) return;

							handleRovingFocus(menuItems[0]);
						}
					}),
					addEventListener(node, 'pointerenter', (e) => {
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						const $activeMenu = get(activeMenu);
						const $rootOpen = get(rootOpen);
						if ($activeMenu && !$rootOpen) {
							rootOpen.set(true);
							activeMenu.set(m.rootIds.menu);
							rootActiveTrigger.set(triggerEl);
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

				const triggerEl = document.getElementById(m.rootIds.trigger);
				if (!triggerEl) return;
				rootActiveTrigger.set(triggerEl);
				addHighlight(triggerEl);
				rootOpen.set(true);
				return;
			}

			if ($activeMenu !== m.rootIds.menu) {
				if (!isBrowser) return;
				if (get(rootOpen)) {
					const triggerEl = document.getElementById(m.rootIds.trigger);
					if (!triggerEl) return;
					removeHighlight(triggerEl);
					rootActiveTrigger.set(null);
					rootOpen.set(false);
				}
				return;
			}
		});

		effect([rootOpen], ([$rootOpen]) => {
			if (!isBrowser) return;
			const triggerEl = document.getElementById(m.rootIds.trigger);
			if (!triggerEl) return;
			if (!$rootOpen && get(activeMenu) === m.rootIds.menu) {
				activeMenu.set('');
				removeHighlight(triggerEl);
				return;
			}
			if ($rootOpen) {
				addHighlight(triggerEl);
			}
		});

		function handleOpen(triggerEl: HTMLElement) {
			rootOpen.update((prev) => {
				const isOpen = !prev;
				if (isOpen) {
					nextFocusable.set(getNextFocusable(triggerEl));
					prevFocusable.set(getPreviousFocusable(triggerEl));
					rootActiveTrigger.set(triggerEl);
					activeMenu.set(m.rootIds.menu);
				} else {
					rootActiveTrigger.set(null);
					activeMenu.set('');
				}

				return isOpen;
			});
		}

		return {
			elements: {
				menu,
				trigger,
				item: m.item,
				checkboxItem: m.checkboxItem,
				arrow: m.arrow,
				separator: m.separator,
			},
			builders: {
				createSubmenu: m.createSubmenu,
				createMenuRadioGroup: m.createMenuRadioGroup,
			},
			states: {
				open: rootOpen,
			},
			options,
		};
	};

	onMount(() => {
		if (!isBrowser) return;

		const menubarEl = document.getElementById(rootIds.menubar);
		if (!menubarEl) return;

		const unsubEvents = executeCallbacks(
			addEventListener(menubarEl, 'keydown', (e) => {
				const target = e.target;
				const menuEl = e.currentTarget;
				if (!isHTMLElement(menuEl) || !isHTMLElement(target)) return;
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
		const target = e.target;

		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const targetIsSubTrigger = target.hasAttribute('data-melt-menubar-menu-subtrigger');
		const isKeyDownInsideSubMenu = target.closest('[role="menu"]') !== currentTarget;

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

	function getMenuTriggers(el: HTMLElement) {
		const menuEl = el.closest('[role="menubar"]');
		if (!isHTMLElement(menuEl)) return [];
		return Array.from(menuEl.querySelectorAll('[data-melt-menubar-trigger]')).filter(
			(el): el is HTMLElement => isHTMLElement(el)
		);
	}

	/**
	 * Keyboard event handler for menubar navigation.
	 * @param e The keyboard event
	 */
	function handleMenubarNavigation(e: KeyboardEvent) {
		e.preventDefault();

		// currently focused menu item
		const currentFocusedItem = document.activeElement;
		// menu element being navigated
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget) || !isHTMLElement(currentFocusedItem)) return;

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
		});

		// Index of the currently focused item in the candidate nodes array
		const currentIndex = candidateNodes.indexOf(currentFocusedItem);

		// Calculate the index of the next menu item
		let nextIndex: number;
		const $loop = get(loop);
		switch (e.key) {
			case kbd.ARROW_RIGHT:
				nextIndex =
					currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : $loop ? 0 : currentIndex;
				break;
			case kbd.ARROW_LEFT:
				nextIndex = currentIndex > 0 ? currentIndex - 1 : $loop ? candidateNodes.length - 1 : 0;
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

		handleRovingFocus(candidateNodes[nextIndex]);
	}

	return {
		elements: {
			menubar,
		},
		builders: {
			createMenu,
		},
		options,
	};
}
