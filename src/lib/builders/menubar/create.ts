import { usePopper } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	SELECTION_KEYS,
	addEventListener,
	addHighlight,
	addMeltEventListener,
	builder,
	createElHelpers,
	derivedVisible,
	effect,
	executeCallbacks,
	getNextFocusable,
	getPortalDestination,
	getPreviousFocusable,
	handleRovingFocus,
	isBrowser,
	isElement,
	isHTMLElement,
	kbd,
	noop,
	removeHighlight,
	removeScroll,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import { safeOnDestroy, safeOnMount } from '$lib/internal/helpers/lifecycle.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store';
import { generateIds } from '../../internal/helpers/id';
import { omit } from '../../internal/helpers/object';
import {
	applyAttrsIfDisabled,
	createMenuBuilder,
	getMenuItems,
	handleMenuNavigation,
	handleTabNavigation,
	type _MenuParts,
} from '../menu/index.js';
import type { MenubarEvents } from './events.js';
import type { CreateMenubarMenuProps, CreateMenubarProps } from './types.js';

const MENUBAR_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];

const { name } = createElHelpers<_MenuParts | 'menu'>('menubar');

const defaults = {
	loop: true,
	closeOnEscape: true,
} satisfies CreateMenubarProps;

export const menubarIdParts = ['menubar'] as const;
export type MenubarIdParts = typeof menubarIdParts;

export function createMenubar(props?: CreateMenubarProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateMenubarProps;

	const options = toWritableStores(omit(withDefaults, 'ids'));
	const { loop, closeOnEscape } = options;
	const activeMenu = writable<string>('');

	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);
	const lastFocusedMenuTrigger = writable<HTMLElement | null>(null);
	const closeTimer = writable(0);
	let scrollRemoved = false;

	const ids = toWritableStores({ ...generateIds(menubarIdParts), ...withDefaults.ids });

	const menubar = builder(name(), {
		stores: [ids.menubar],
		returned([$menubarId]) {
			return {
				role: 'menubar',
				'data-melt-menubar': '',
				'data-orientation': 'horizontal',
				id: $menubarId,
			};
		},
		action: (node: HTMLElement) => {
			const menuTriggers = Array.from(node.querySelectorAll('[data-melt-menubar-trigger]'));
			if (!isHTMLElement(menuTriggers[0])) return {};
			menuTriggers[0].tabIndex = 0;

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
		portal: undefined,
		forceVisible: false,
		defaultOpen: false,
		typeahead: true,
		closeFocus: undefined,
		disableFocusFirstItem: false,
		closeOnItemClick: true,
		onOutsideClick: undefined,
	} satisfies CreateMenubarMenuProps;

	const createMenu = (props?: CreateMenubarMenuProps) => {
		const withDefaults = { ...menuDefaults, ...props } satisfies CreateMenubarMenuProps;
		const rootOpen = writable(false);
		const rootActiveTrigger = writable<HTMLElement | null>(null);

		// options
		const options = toWritableStores(withDefaults);
		const { positioning, portal, forceVisible, closeOnOutsideClick, onOutsideClick } = options;

		const m = createMenuBuilder({
			rootOptions: options,
			rootOpen,
			rootActiveTrigger,
			nextFocusable,
			prevFocusable,
			selector: 'menubar-menu',
			removeScroll: false,
		});

		const isVisible = derivedVisible({
			open: rootOpen,
			forceVisible,
			activeTrigger: rootActiveTrigger,
		});

		const menu = builder(name('menu'), {
			stores: [isVisible, portal, m.ids.menu, m.ids.trigger, ids.menubar],
			returned: ([$isVisible, $portal, $menuId, $triggerId, $menubarId]) => {
				return {
					role: 'menu',
					hidden: $isVisible ? undefined : true,
					style: styleToString({
						display: $isVisible ? undefined : 'none',
					}),
					id: $menuId,
					'aria-labelledby': $triggerId,
					'data-state': $isVisible ? 'open' : 'closed',
					'data-melt-scope': $menubarId,
					'data-portal': $portal ? '' : undefined,
					tabindex: -1,
				} as const;
			},
			action: (node: HTMLElement): MeltActionReturn<MenubarEvents['menu']> => {
				let unsubPopper = noop;

				const unsubDerived = effect(
					[rootOpen, rootActiveTrigger, positioning, portal, closeOnOutsideClick],
					([$rootOpen, $rootActiveTrigger, $positioning, $portal, $closeOnOutsideClick]) => {
						unsubPopper();
						if (!($rootOpen && $rootActiveTrigger)) return;

						tick().then(() => {
							const popper = usePopper(node, {
								anchorElement: $rootActiveTrigger,
								open: rootOpen,
								options: {
									floating: $positioning,
									portal: getPortalDestination(node, $portal),
									clickOutside: $closeOnOutsideClick
										? {
												ignore: (e) => {
													const target = e.target;
													const menubarEl = document.getElementById(get(ids.menubar));
													if (!menubarEl || !isElement(target)) return false;
													return menubarEl.contains(target);
												},
												handler: (e) => {
													get(onOutsideClick)?.(e);
													if (e.defaultPrevented) return;
													activeMenu.set('');
												},
										  }
										: null,
								},
							});

							if (popper && popper.destroy) {
								unsubPopper = popper.destroy;
							}
						});
					}
				);

				const unsubEvents = executeCallbacks(
					addMeltEventListener(node, 'keydown', (e) => {
						const target = e.target;
						const menuEl = e.currentTarget;

						if (!isHTMLElement(menuEl) || !isHTMLElement(target)) return;

						if (MENUBAR_NAV_KEYS.includes(e.key)) {
							handleCrossMenuNavigation(e);
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
			stores: [rootOpen, m.ids.menu, m.ids.trigger],
			returned: ([$rootOpen, $menuId, $triggerId]) => {
				return {
					'aria-controls': $menuId,
					'aria-expanded': $rootOpen,
					'data-state': $rootOpen ? 'open' : 'closed',
					id: $triggerId,
					'aria-haspopup': 'menu',
					'data-orientation': 'horizontal',
					role: 'menuitem',
				} as const;
			},
			action: (node: HTMLElement): MeltActionReturn<MenubarEvents['trigger']> => {
				applyAttrsIfDisabled(node);

				const menubarEl = document.getElementById(get(ids.menubar));
				if (!menubarEl) return {};

				const menubarTriggers = Array.from(
					menubarEl.querySelectorAll('[data-melt-menubar-trigger]')
				);

				if (!menubarTriggers.length) return {};

				const unsubEffect = effect([lastFocusedMenuTrigger], ([$lastFocusedMenuTrigger]) => {
					if (!$lastFocusedMenuTrigger && menubarTriggers[0] === node) {
						node.tabIndex = 0;
					} else if ($lastFocusedMenuTrigger === node) {
						node.tabIndex = 0;
					} else {
						node.tabIndex = -1;
					}
				});

				if (menubarTriggers[0] === node) {
					node.tabIndex = 0;
				} else {
					node.tabIndex = -1;
				}

				const unsub = executeCallbacks(
					addMeltEventListener(node, 'click', (e) => {
						const $rootOpen = get(rootOpen);
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						handleOpen(triggerEl);
						if (!$rootOpen) e.preventDefault();
					}),
					addMeltEventListener(node, 'keydown', (e) => {
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
					addMeltEventListener(node, 'pointerenter', (e) => {
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						const $activeMenu = get(activeMenu);
						const $rootOpen = get(rootOpen);
						if ($activeMenu && !$rootOpen) {
							rootOpen.set(true);
							activeMenu.set(get(m.ids.menu));
							rootActiveTrigger.set(triggerEl);
						}
					})
				);

				return {
					destroy() {
						unsub();
						unsubEffect();
					},
				};
			},
		});

		function handleOpen(triggerEl: HTMLElement) {
			rootOpen.update((prev) => {
				const isOpen = !prev;
				if (isOpen) {
					nextFocusable.set(getNextFocusable(triggerEl));
					prevFocusable.set(getPreviousFocusable(triggerEl));
					rootActiveTrigger.set(triggerEl);
					activeMenu.set(get(m.ids.menu));
				} else {
					rootActiveTrigger.set(null);
				}

				return isOpen;
			});
		}

		effect([activeMenu], ([$activeMenu]) => {
			if (!isBrowser) return;
			if ($activeMenu === get(m.ids.menu)) {
				if (get(rootOpen)) return;

				const triggerEl = document.getElementById(get(m.ids.trigger));
				if (!triggerEl) return;
				rootActiveTrigger.set(triggerEl);
				addHighlight(triggerEl);
				rootOpen.set(true);
				return;
			}

			if ($activeMenu !== get(m.ids.menu)) {
				if (!isBrowser) return;
				if (get(rootOpen)) {
					const triggerEl = document.getElementById(get(m.ids.trigger));
					if (!triggerEl) return;
					rootActiveTrigger.set(null);
					rootOpen.set(false);
					removeHighlight(triggerEl);
				}
				return;
			}
		});

		effect([rootOpen], ([$rootOpen]) => {
			if (!isBrowser) return;
			const triggerEl = document.getElementById(get(m.ids.trigger));
			if (!triggerEl) return;
			if (!$rootOpen && get(activeMenu) === get(m.ids.menu)) {
				rootActiveTrigger.set(null);
				activeMenu.set('');
				removeHighlight(triggerEl);
				return;
			}
			if ($rootOpen) {
				lastFocusedMenuTrigger.set(triggerEl);
				addHighlight(triggerEl);
			}
		});

		safeOnMount(() => {
			if (!isBrowser) return;
			const triggerEl = document.getElementById(get(m.ids.trigger));
			if (isHTMLElement(triggerEl) && get(rootOpen)) {
				rootActiveTrigger.set(triggerEl);
			}
		});

		return {
			ids: m.ids,
			elements: {
				menu,
				trigger,
				item: m.item,
				arrow: m.arrow,
				separator: m.separator,
				group: m.group,
				groupLabel: m.groupLabel,
			},
			builders: {
				createCheckboxItem: m.createCheckboxItem,
				createSubmenu: m.createSubmenu,
				createMenuRadioGroup: m.createMenuRadioGroup,
			},
			states: {
				open: rootOpen,
			},
			options,
		};
	};

	/* -------- */
	/* Helpers */
	/* -------- */

	/**
	 * KBD Navigation handler for moving between menus in the menu bar.
	 */
	function handleCrossMenuNavigation(e: KeyboardEvent) {
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

		// Index of the currently focused item in the candidate nodes array
		const menubarEl = document.getElementById(get(ids.menubar));
		if (!isHTMLElement(menubarEl)) return;
		const triggers = getMenuTriggers(menubarEl);
		const currTriggerId = currentTarget.getAttribute('aria-labelledby');

		const currIndex = triggers.findIndex((trigger) => trigger.id === currTriggerId);

		let nextIndex: number;
		switch (e.key) {
			case kbd.ARROW_RIGHT:
				nextIndex = currIndex < triggers.length - 1 ? currIndex + 1 : 0;
				break;
			case kbd.ARROW_LEFT:
				nextIndex = currIndex > 0 ? currIndex - 1 : triggers.length - 1;
				break;
			case kbd.HOME:
				nextIndex = 0;
				break;
			case kbd.END:
				nextIndex = triggers.length - 1;
				break;
			default:
				return;
		}

		const nextFocusedTrigger = triggers[nextIndex];
		const menuId = nextFocusedTrigger.getAttribute('aria-controls');
		menuId && activeMenu.set(menuId);
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

	/* --------------------*/
	/* Lifecycle & Effects */
	/* --------------------*/

	safeOnMount(() => {
		if (!isBrowser) return;

		const menubarEl = document.getElementById(get(ids.menubar));
		if (!menubarEl) return;
		const unsubEvents = executeCallbacks(
			addMeltEventListener(menubarEl, 'keydown', (e) => {
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
				if (get(closeOnEscape) && e.key === kbd.ESCAPE) {
					window.clearTimeout(get(closeTimer));
					activeMenu.set('');
				}
			})
		);

		return () => {
			unsubEvents();
		};
	});

	const unsubs: Array<() => void> = [];
	effect([activeMenu], ([$activeMenu]) => {
		if (!isBrowser) return;

		/**
		 * To prevent adding/removing the scroll as we cycle through
		 * menus (which causes horrible performance issues), we only
		 * want to remove the scroll when the first menu is opened, and
		 * remove it when no menus are open.
		 */

		if (!$activeMenu) {
			unsubs.forEach((unsub) => unsub());
			scrollRemoved = false;
		} else if (!scrollRemoved) {
			unsubs.push(removeScroll());
			scrollRemoved = true;
		}
	});

	safeOnDestroy(() => {
		unsubs.forEach((unsub) => unsub());
	});

	return {
		ids,
		elements: {
			menubar,
		},
		builders: {
			createMenu,
		},
		options,
	};
}
