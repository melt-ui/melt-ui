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
	isHTMLElement,
	type EventHandler,
	isElementDisabled,
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
			return (e: PointerEvent) => {
				const isMovingTowards = $pointerDir === $pointerGraceIntent?.side;

				return isMovingTowards && isPointerInGraceArea(e, $pointerGraceIntent?.area);
			};
		}
	);

	const rootIds = {
		menu: uuid(),
		trigger: uuid(),
	};

	const rootMenu = elementDerived(
		[rootOpen, rootActiveTrigger, rootOptions],
		([$rootOpen, $rootActiveTrigger, $rootOptions], { addAction, attach, getElement }) => {
			if ($rootOpen && $rootActiveTrigger) {
				getElement().then((element) => {
					if (!isBrowser) return;
					if (!isHTMLElement(element)) return;
					setMeltMenuAttribute(element);
					if (isElementDisabled(element)) {
						element.setAttribute('data-disabled', '');
					}
				});
				addAction(usePopper, {
					anchorElement: $rootActiveTrigger,
					open: rootOpen,
					options: {
						floating: $rootOptions.positioning,
						focusTrap: null,
					},
				});

				attach('keydown', (e) => {
					// submenu key events bubble through portals
					// we only care about key events that happen inside this menu
					const target = e.target;
					if (!isHTMLElement(target)) return;

					const isKeyDownInside = target.closest('[data-melt-menu]') === e.currentTarget;

					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					const isCharacterKey = e.key.length === 1;
					if (!isKeyDownInside) return;

					if (FIRST_LAST_KEYS.includes(e.key)) {
						handleMenuNavigation(e);
					}

					// menus should not be navigated using tab so we prevent it
					// reference: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					if (e.key === 'Tab') e.preventDefault();

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
			attach('pointerdown', (e) => {
				const triggerElement = e.currentTarget;
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
				if (!$rootOpen) e.preventDefault();
			});

			attach('keydown', (e) => {
				const triggerElement = e.currentTarget;
				if (!isHTMLElement(triggerElement)) return;

				if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN) {
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

				e.preventDefault();
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
		onSelect?: EventHandler;
	};

	const itemDefaults = {} satisfies Defaults<ItemArgs>;

	const item = elementMultiDerived([], (_, { attach, getElement }) => {
		return (args?: ItemArgs) => {
			const itemArgs = { ...itemDefaults, ...args } as ItemArgs;
			const { onSelect } = itemArgs;

			getElement().then((element) => {
				setMeltMenuAttribute(element);
				handleDisabledMenuItem(element);
			});

			attach('pointerdown', (e) => {
				const itemElement = e.currentTarget;
				if (!isHTMLElement(itemElement)) return;
				if (isElementDisabled(itemElement)) {
					e.preventDefault();
					return;
				}
			});

			attach('click', (e) => {
				const itemElement = e.currentTarget;
				if (!isHTMLElement(itemElement)) return;
				if (isElementDisabled(itemElement)) {
					e.preventDefault();
					return;
				}

				if (e.defaultPrevented) {
					if (!isHTMLElement(itemElement)) return;

					handleRovingFocus(itemElement);
					return;
				}
				onSelect?.(e);
				rootOpen.set(false);
			});

			attach('keydown', (e) => {
				if (SELECTION_KEYS.includes(e.key)) {
					const itemElement = e.currentTarget;
					if (!isHTMLElement(itemElement)) return;

					itemElement.click();
					/**
					 * We prevent default browser behaviour for selection keys as they should trigger
					 * a selection only:
					 * - prevents space from scrolling the page.
					 * - if keydown causes focus to move, prevents keydown from firing on the new target.
					 */
					e.preventDefault();
				}
			});

			attach('pointermove', (e) => {
				const itemElement = e.currentTarget;
				if (!isHTMLElement(itemElement)) return;

				if (isElementDisabled(itemElement)) {
					onItemLeave(e);
					return;
				}

				onMenuItemPointerMove(e);
			});

			attach('pointerleave', (e) => {
				onMenuItemPointerLeave(e);
			});

			attach('focusin', (e) => {
				const itemElement = e.currentTarget;
				if (!isHTMLElement(itemElement)) return;
				itemElement.setAttribute('data-highlighted', '');
			});

			attach('focusout', (e) => {
				const itemElement = e.currentTarget;
				if (!isHTMLElement(itemElement)) return;
				itemElement.removeAttribute('data-highlighted');
			});

			return {
				role: 'menuitem',
				tabindex: -1,
				'data-orientation': 'vertical',
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

				attach('keydown', (e) => {
					if (e.key === kbd.ESCAPE) {
						return;
					}

					// Submenu key events bubble through portals.
					// We only want the keys in this menu.
					const target = e.target;
					if (!isHTMLElement(target)) return;

					const currentTarget = e.currentTarget;
					if (!isHTMLElement(currentTarget)) return;

					const targetMeltMenuId = target.getAttribute('data-melt-menu-id');
					if (!targetMeltMenuId) return;

					const isKeyDownInside =
						target.closest('[data-melt-menu]') === currentTarget &&
						targetMeltMenuId === currentTarget.id;

					const isCloseKey = SUB_CLOSE_KEYS['ltr'].includes(e.key);
					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					const isCharacterKey = e.key.length === 1;

					if (!isKeyDownInside) return;

					if (FIRST_LAST_KEYS.includes(e.key)) {
						// prevent events from bubbling
						e.stopImmediatePropagation();
						handleMenuNavigation(e);
					}

					// close the submenu if the user presses a close key
					if (isCloseKey) {
						e.preventDefault();
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
					if (e.key === 'Tab') e.preventDefault();
					if (!isModifierKey && isCharacterKey) {
						// typeahead logic
					}
				});

				attach('pointermove', (e) => {
					onMenuPointerMove(e);
				});

				attach('focusout', (e) => {
					if (get(isUsingKeyboard)) {
						const target = e.target;
						if (!isHTMLElement(target)) return;

						const submenuElement = document.getElementById(subIds.menu);
						if (!isHTMLElement(submenuElement)) return;

						if (!submenuElement?.contains(target) && target !== $subActiveTrigger) {
							subOpen.set(false);
							subActiveTrigger.set(null);
						}
					} else {
						const menuElement = e.currentTarget;
						if (!isHTMLElement(menuElement)) return;

						const relatedTarget = e.relatedTarget;
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
				getElement().then((element) => {
					setMeltMenuAttribute(element);
					handleDisabledMenuItem(element);
				});

				addUnsubscriber(() => {
					if (!isBrowser) return;
					clearOpenTimer(subOpenTimer);
					window.clearTimeout(get(pointerGraceTimer));
					pointerGraceIntent.set(null);
				});

				attach('click', (e) => {
					// Manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					handleRovingFocus(triggerElement);
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

				attach('keydown', (e) => {
					if (SUB_OPEN_KEYS['ltr'].includes(e.key)) {
						const triggerElement = e.currentTarget;
						if (!isHTMLElement(triggerElement)) return;

						if (!$subOpen) {
							triggerElement.click();
							e.preventDefault();
							return;
						}

						const menuId = triggerElement.getAttribute('aria-controls');
						if (!menuId) return;

						const menuElement = document.getElementById(menuId);
						if (!isHTMLElement(menuElement)) return;

						const firstItem = getMenuItems(menuElement)[0];
						if (!isHTMLElement(firstItem)) return;

						handleRovingFocus(firstItem);
					}
				});

				attach('pointermove', (e) => {
					if (!isMouse(e)) return;

					onItemEnter(e);

					if (e.defaultPrevented) return;

					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					handleRovingFocus(triggerElement);

					const openTimer = get(subOpenTimer);
					if (!$subOpen && !openTimer) {
						subOpenTimer.set(
							window.setTimeout(() => {
								subOpen.update(() => {
									subActiveTrigger.set(triggerElement);
									return true;
								});
								clearOpenTimer(subOpenTimer);
							}, 100)
						);
					}
				});

				attach('pointerleave', (e) => {
					if (!isMouse(e)) return;
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
								{ x: e.clientX + bleed, y: e.clientY },
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
						onTriggerLeave(e);
						if (e.defaultPrevented) return;

						// There's 100ms where the user may leave an item before the submenu was opened.
						pointerGraceIntent.set(null);
					}
				});

				attach('focusout', (e) => {
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;

					if (!isHTMLElement(triggerElement)) return;
					triggerElement.removeAttribute('data-highlighted');

					const relatedTarget = e.relatedTarget;
					if (!isHTMLElement(relatedTarget)) return;

					const menuId = triggerElement.getAttribute('aria-controls');
					if (!menuId) return;

					const menu = document.getElementById(menuId);

					if (isHTMLElement(menu) && !menu.contains(relatedTarget)) {
						subActiveTrigger.set(null);
						subOpen.set(false);
					}
				});

				attach('focusin', (e) => {
					const triggerElement = e.currentTarget;
					if (!isHTMLElement(triggerElement)) return;
					triggerElement.setAttribute('data-highlighted', '');
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

			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === kbd.ESCAPE) {
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
			// Hacky way to prevent the keydown e from triggering on the trigger
			handleRovingFocus($rootActiveTrigger);
		}
	});

	/* -------------------------------------------------------------------------------------------------
	 * Pointer Event Effects
	 * -----------------------------------------------------------------------------------------------*/

	function onItemEnter(e: PointerEvent) {
		if (isPointerMovingToSubmenu(e)) {
			e.preventDefault();
		}
	}

	function onItemLeave(e: PointerEvent) {
		if (isPointerMovingToSubmenu(e)) {
			return;
		}
		const target = e.target;
		if (!isHTMLElement(target)) return;

		const parentMenuElement = getParentMenu(target);
		if (!isHTMLElement(parentMenuElement)) return;

		handleRovingFocus(parentMenuElement);
	}

	function onTriggerLeave(e: PointerEvent) {
		if (isPointerMovingToSubmenu(e)) {
			e.preventDefault();
		}
	}

	function onMenuPointerMove(e: PointerEvent) {
		if (!isMouse(e)) return;

		const target = e.target;
		if (!isHTMLElement(target)) return;

		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		const $lastPointerX = get(lastPointerX);
		const pointerXHasChanged = $lastPointerX !== e.clientX;

		// We don't use `e.movementX` for this check because Safari will
		// always return `0` on a pointer e.
		if (currentTarget.contains(target) && pointerXHasChanged) {
			const newDir = e.clientX > $lastPointerX ? 'right' : 'left';
			pointerDir.set(newDir);
			lastPointerX.set(e.clientX);
		}
	}

	function onMenuItemPointerMove(e: PointerEvent) {
		if (!isMouse(e)) return;
		onItemEnter(e);
		if (!e.defaultPrevented) {
			const currentTarget = e.currentTarget;
			if (!isHTMLElement(currentTarget)) return;
			// focus on the current menu item
			handleRovingFocus(currentTarget);
		}
	}

	function onMenuItemPointerLeave(e: PointerEvent) {
		if (!isMouse(e)) return;
		onItemLeave(e);
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	function handleDisabledMenuItem(element: HTMLElement | null) {
		if (!isBrowser) return;
		if (!isHTMLElement(element)) return;
		if (isElementDisabled(element)) {
			element.setAttribute('data-disabled', '');
			element.setAttribute('aria-disabled', 'true');
		}
	}

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

	function isPointerMovingToSubmenu(e: PointerEvent) {
		return get(pointerMovingToSubmenu)(e);
	}

	/**
	 * Check if the event is a mouse event
	 * @param e The pointer event
	 */
	function isMouse(e: PointerEvent) {
		return e.pointerType === 'mouse';
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

function isPointerInGraceArea(e: PointerEvent, area?: Polygon) {
	if (!area) return false;
	const cursorPos = { x: e.clientX, y: e.clientY };
	return isPointInPolygon(cursorPos, area);
}
