import { createSeparator } from '$lib/builders/index.js';
import { usePopper } from '$lib/internal/actions/index.js';
import {
	FIRST_LAST_KEYS,
	SELECTION_KEYS,
	addEventListener,
	addHighlight,
	addMeltEventListener,
	makeElement,
	createElHelpers,
	createTypeaheadSearch,
	derivedVisible,
	disabledAttr,
	effect,
	executeCallbacks,
	generateIds,
	getNextFocusable,
	getPortalDestination,
	getPreviousFocusable,
	handleFocus,
	handleRovingFocus,
	isBrowser,
	isElementDisabled,
	isHTMLElement,
	kbd,
	noop,
	omit,
	overridable,
	removeHighlight,
	removeScroll,
	sleep,
	styleToString,
	toWritableStores,
	portalAttr,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn, TextDirection } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';

import { safeOnMount } from '$lib/internal/helpers/lifecycle.js';
import { withGet, type WithGet } from '$lib/internal/helpers/withGet.js';
import type { MenuEvents } from './events.js';
import type {
	Selector,
	_CheckboxItemProps,
	_CreateMenuProps,
	_CreateRadioGroupProps,
	_CreateSubmenuProps,
	_MenuBuilderOptions,
	_MenuParts,
	_RadioItemProps,
} from './types.js';

export const SUB_OPEN_KEYS: Record<TextDirection, string[]> = {
	ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
	rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT],
};
export const SUB_CLOSE_KEYS: Record<TextDirection, string[]> = {
	ltr: [kbd.ARROW_LEFT],
	rtl: [kbd.ARROW_RIGHT],
};

export const menuIdParts = ['menu', 'trigger'] as const;
export type _MenuIdParts = typeof menuIdParts;

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	portal: undefined,
	loop: false,
	dir: 'ltr',
	defaultOpen: false,
	typeahead: true,
	closeOnItemClick: true,
	onOutsideClick: undefined,
} satisfies Defaults<_CreateMenuProps>;

export function createMenuBuilder(opts: _MenuBuilderOptions) {
	const { name, selector } = createElHelpers<_MenuParts>(opts.selector);

	const {
		preventScroll,
		arrowSize,
		positioning,
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		forceVisible,
		typeahead,
		loop,
		closeFocus,
		disableFocusFirstItem,
		closeOnItemClick,
		onOutsideClick,
	} = opts.rootOptions;

	const rootOpen = opts.rootOpen;
	const rootActiveTrigger = opts.rootActiveTrigger;
	/**
	 * Keeps track of the next/previous focusable element when the menu closes.
	 * This is because we are portaling the menu to the body and we need
	 * to be able to focus the next element in the DOM when the menu closes.
	 *
	 * Without keeping track of this, the focus would be reset to the top of
	 * the page (or the first focusable element in the body).
	 */
	const nextFocusable = opts.nextFocusable;
	const prevFocusable = opts.prevFocusable;

	/**
	 * Keeps track of if the user is using the keyboard to navigate the menu.
	 * This is used to determine how we handle focus on open behavior differently
	 * than when the user is using the mouse.
	 */
	const isUsingKeyboard = withGet.writable(false);

	/**
	 * Stores used to manage the grace area for submenus. This prevents us
	 * from closing a submenu when the user is moving their mouse from the
	 * trigger to the submenu.
	 */
	const lastPointerX = withGet(writable(0));
	const pointerGraceIntent = withGet(writable<GraceIntent | null>(null));
	const pointerDir = withGet(writable<Side>('right'));

	/**
	 * Track currently focused item in the menu.
	 */
	const currentFocusedItem = withGet(writable<HTMLElement | null>(null));

	const pointerMovingToSubmenu = withGet(
		derived([pointerDir, pointerGraceIntent], ([$pointerDir, $pointerGraceIntent]) => {
			return (e: PointerEvent) => {
				const isMovingTowards = $pointerDir === $pointerGraceIntent?.side;

				return isMovingTowards && isPointerInGraceArea(e, $pointerGraceIntent?.area);
			};
		})
	);

	const { typed, handleTypeaheadSearch } = createTypeaheadSearch();

	const rootIds = toWritableStores({ ...generateIds(menuIdParts), ...opts.ids });

	const isVisible = derivedVisible({
		open: rootOpen,
		forceVisible,
		activeTrigger: rootActiveTrigger,
	});

	const rootMenu = makeElement(name(), {
		stores: [isVisible, portal, rootIds.menu, rootIds.trigger],
		returned: ([$isVisible, $portal, $rootMenuId, $rootTriggerId]) => {
			return {
				role: 'menu',
				hidden: $isVisible ? undefined : true,
				style: styleToString({
					display: $isVisible ? undefined : 'none',
				}),
				id: $rootMenuId,
				'aria-labelledby': $rootTriggerId,
				'data-state': $isVisible ? 'open' : 'closed',
				'data-portal': portalAttr($portal),
				tabindex: -1,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<MenuEvents['menu']> => {
			let unsubPopper = noop;

			const unsubDerived = effect(
				[isVisible, rootActiveTrigger, positioning, closeOnOutsideClick, portal, closeOnEscape],
				([
					$isVisible,
					$rootActiveTrigger,
					$positioning,
					$closeOnOutsideClick,
					$portal,
					$closeOnEscape,
				]) => {
					unsubPopper();
					if (!$isVisible || !$rootActiveTrigger) return;
					tick().then(() => {
						setMeltMenuAttribute(node, selector);
						const popper = usePopper(node, {
							anchorElement: $rootActiveTrigger,
							open: rootOpen,
							options: {
								floating: $positioning,
								clickOutside: $closeOnOutsideClick
									? {
											handler: (e) => {
												onOutsideClick.get()?.(e);
												if (e.defaultPrevented) return;

												if (
													isHTMLElement($rootActiveTrigger) &&
													!$rootActiveTrigger.contains(e.target as Element)
												) {
													rootOpen.set(false);
													$rootActiveTrigger.focus();
												}
											},
									  }
									: null,
								portal: getPortalDestination(node, $portal),
								escapeKeydown: $closeOnEscape ? undefined : null,
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
					if (!isHTMLElement(target) || !isHTMLElement(menuEl)) return;

					/**
					 * Submenu key events bubble through portals and
					 * we only care about key events that happen inside this menu.
					 */
					const isKeyDownInside = target.closest('[role="menu"]') === menuEl;

					if (!isKeyDownInside) return;
					if (FIRST_LAST_KEYS.includes(e.key)) {
						handleMenuNavigation(e, loop.get() ?? false);
					}

					/**
					 * Menus should not be navigated using tab
					 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
					 */
					if (e.key === kbd.TAB) {
						e.preventDefault();
						rootOpen.set(false);
						handleTabNavigation(e, nextFocusable, prevFocusable);
						return;
					}

					/**
					 * Check for typeahead search and handle it.
					 */
					const isCharacterKey = e.key.length === 1;
					const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
					if (!isModifierKey && isCharacterKey && typeahead.get() === true) {
						handleTypeaheadSearch(e.key, getMenuItems(menuEl));
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

	const rootTrigger = makeElement(name('trigger'), {
		stores: [rootOpen, rootIds.menu, rootIds.trigger],
		returned: ([$rootOpen, $rootMenuId, $rootTriggerId]) => {
			return {
				'aria-controls': $rootMenuId,
				'aria-expanded': $rootOpen,
				'data-state': $rootOpen ? 'open' : 'closed',
				id: $rootTriggerId,
				tabindex: 0,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<MenuEvents['trigger']> => {
			applyAttrsIfDisabled(node);
			rootActiveTrigger.update((p) => {
				if (p) return p;
				return node;
			});

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const $rootOpen = rootOpen.get();
					const triggerEl = e.currentTarget;
					if (!isHTMLElement(triggerEl)) return;

					handleOpen(triggerEl);
					if (!$rootOpen) e.preventDefault();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const triggerEl = e.currentTarget;
					if (!isHTMLElement(triggerEl)) return;
					if (!(SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN)) return;
					e.preventDefault();
					handleOpen(triggerEl);

					const menuId = triggerEl.getAttribute('aria-controls');
					if (!menuId) return;

					const menu = document.getElementById(menuId);
					if (!menu) return;

					const menuItems = getMenuItems(menu);
					if (!menuItems.length) return;

					handleRovingFocus(menuItems[0]);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const rootArrow = makeElement(name('arrow'), {
		stores: arrowSize,
		returned: ($arrowSize) => ({
			'data-arrow': true,
			style: styleToString({
				position: 'absolute',
				width: `var(--arrow-size, ${$arrowSize}px)`,
				height: `var(--arrow-size, ${$arrowSize}px)`,
			}),
		}),
	});

	const item = makeElement(name('item'), {
		returned: () => {
			return {
				role: 'menuitem',
				tabindex: -1,
				'data-orientation': 'vertical',
			};
		},
		action: (node: HTMLElement): MeltActionReturn<MenuEvents['item']> => {
			setMeltMenuAttribute(node, selector);
			applyAttrsIfDisabled(node);

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', (e) => {
					const itemEl = e.currentTarget;
					if (!isHTMLElement(itemEl)) return;
					if (isElementDisabled(itemEl)) {
						e.preventDefault();
						return;
					}
				}),
				addMeltEventListener(node, 'click', (e) => {
					const itemEl = e.currentTarget;
					if (!isHTMLElement(itemEl)) return;
					if (isElementDisabled(itemEl)) {
						e.preventDefault();
						return;
					}

					if (e.defaultPrevented) {
						handleRovingFocus(itemEl);
						return;
					}

					if (closeOnItemClick.get()) {
						// Allows forms to submit before the menu is removed from the DOM
						sleep(1).then(() => {
							rootOpen.set(false);
						});
					}
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					onItemKeyDown(e);
				}),
				addMeltEventListener(node, 'pointermove', (e) => {
					onMenuItemPointerMove(e);
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					onMenuItemPointerLeave(e);
				}),
				addMeltEventListener(node, 'focusin', (e) => {
					onItemFocusIn(e);
				}),
				addMeltEventListener(node, 'focusout', (e) => {
					onItemFocusOut(e);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const group = makeElement(name('group'), {
		returned: () => {
			return (groupId: string) => ({
				role: 'group',
				'aria-labelledby': groupId,
			});
		},
	});

	const groupLabel = makeElement(name('group-label'), {
		returned: () => {
			return (groupId: string) => ({
				id: groupId,
			});
		},
	});

	const checkboxItemDefaults = {
		defaultChecked: false,
		disabled: false,
	};

	const createCheckboxItem = (props?: _CheckboxItemProps) => {
		const withDefaults = { ...checkboxItemDefaults, ...props } satisfies _CheckboxItemProps;
		const checkedWritable = withDefaults.checked ?? writable(withDefaults.defaultChecked ?? null);
		const checked = overridable(checkedWritable, withDefaults.onCheckedChange);
		const disabled = writable(withDefaults.disabled);

		const checkboxItem = makeElement(name('checkbox-item'), {
			stores: [checked, disabled],
			returned: ([$checked, $disabled]) => {
				return {
					role: 'menuitemcheckbox',
					tabindex: -1,
					'data-orientation': 'vertical',
					'aria-checked': isIndeterminate($checked) ? 'mixed' : $checked ? 'true' : 'false',
					'data-disabled': disabledAttr($disabled),
					'data-state': getCheckedState($checked),
				} as const;
			},
			action: (node: HTMLElement): MeltActionReturn<MenuEvents['checkboxItem']> => {
				setMeltMenuAttribute(node, selector);
				applyAttrsIfDisabled(node);

				const unsub = executeCallbacks(
					addMeltEventListener(node, 'pointerdown', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;
						if (isElementDisabled(itemEl)) {
							e.preventDefault();
							return;
						}
					}),
					addMeltEventListener(node, 'click', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;
						if (isElementDisabled(itemEl)) {
							e.preventDefault();
							return;
						}

						if (e.defaultPrevented) {
							handleRovingFocus(itemEl);
							return;
						}
						checked.update((prev) => {
							if (isIndeterminate(prev)) return true;
							return !prev;
						});

						if (closeOnItemClick.get()) {
							// We're waiting for a tick to let the checked store update
							// before closing the menu. If we don't, and the user was to hit
							// spacebar or enter twice really fast, the menu would close and
							// reopen without the checked state being updated.
							tick().then(() => {
								rootOpen.set(false);
							});
						}
					}),
					addMeltEventListener(node, 'keydown', (e) => {
						onItemKeyDown(e);
					}),
					addMeltEventListener(node, 'pointermove', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;

						if (isElementDisabled(itemEl)) {
							onItemLeave(e);
							return;
						}

						onMenuItemPointerMove(e, itemEl);
					}),
					addMeltEventListener(node, 'pointerleave', (e) => {
						onMenuItemPointerLeave(e);
					}),
					addMeltEventListener(node, 'focusin', (e) => {
						onItemFocusIn(e);
					}),
					addMeltEventListener(node, 'focusout', (e) => {
						onItemFocusOut(e);
					})
				);

				return {
					destroy: unsub,
				};
			},
		});

		const isChecked = derived(checked, ($checked) => $checked === true);
		const _isIndeterminate = derived(checked, ($checked) => $checked === 'indeterminate');

		return {
			elements: {
				checkboxItem,
			},
			states: {
				checked,
			},
			helpers: {
				isChecked,
				isIndeterminate: _isIndeterminate,
			},
			options: {
				disabled,
			},
		};
	};

	const createMenuRadioGroup = (args: _CreateRadioGroupProps = {}) => {
		const valueWritable = args.value ?? writable(args.defaultValue ?? null);
		const value = overridable(valueWritable, args.onValueChange);

		const radioGroup = makeElement(name('radio-group'), {
			returned: () => ({
				role: 'group',
			}),
		});

		const radioItemDefaults = {
			disabled: false,
		};

		const radioItem = makeElement(name('radio-item'), {
			stores: [value],
			returned: ([$value]) => {
				return (itemProps: _RadioItemProps) => {
					const { value: itemValue, disabled } = { ...radioItemDefaults, ...itemProps };
					const checked = $value === itemValue;

					return {
						disabled,
						role: 'menuitemradio',
						'data-state': checked ? 'checked' : 'unchecked',
						'aria-checked': checked,
						'data-disabled': disabledAttr(disabled),
						'data-value': itemValue,
						'data-orientation': 'vertical',
						tabindex: -1,
					};
				};
			},
			action: (node: HTMLElement): MeltActionReturn<MenuEvents['radioItem']> => {
				setMeltMenuAttribute(node, selector);

				const unsub = executeCallbacks(
					addMeltEventListener(node, 'pointerdown', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;
						const itemValue = node.dataset.value;
						const disabled = node.dataset.disabled;

						if (disabled || itemValue === undefined) {
							e.preventDefault();
							return;
						}
					}),
					addMeltEventListener(node, 'click', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;
						const itemValue = node.dataset.value;
						const disabled = node.dataset.disabled;

						if (disabled || itemValue === undefined) {
							e.preventDefault();
							return;
						}

						if (e.defaultPrevented) {
							if (!isHTMLElement(itemEl)) return;
							handleRovingFocus(itemEl);
							return;
						}

						value.set(itemValue);

						if (closeOnItemClick.get()) {
							// We're waiting for a tick to let the checked store update
							// before closing the menu. If we don't, and the user was to hit
							// spacebar or enter twice really fast, the menu would close and
							// reopen without the checked state being updated.
							tick().then(() => {
								rootOpen.set(false);
							});
						}
					}),
					addMeltEventListener(node, 'keydown', (e) => {
						onItemKeyDown(e);
					}),
					addMeltEventListener(node, 'pointermove', (e) => {
						const itemEl = e.currentTarget;
						if (!isHTMLElement(itemEl)) return;

						const itemValue = node.dataset.value;
						const disabled = node.dataset.disabled;

						if (disabled || itemValue === undefined) {
							onItemLeave(e);
							return;
						}
						onMenuItemPointerMove(e, itemEl);
					}),
					addMeltEventListener(node, 'pointerleave', (e) => {
						onMenuItemPointerLeave(e);
					}),
					addMeltEventListener(node, 'focusin', (e) => {
						onItemFocusIn(e);
					}),
					addMeltEventListener(node, 'focusout', (e) => {
						onItemFocusOut(e);
					})
				);

				return {
					destroy: unsub,
				};
			},
		});

		const isChecked = derived(value, ($value) => {
			return (itemValue: string) => {
				return $value === itemValue;
			};
		});

		return {
			elements: {
				radioGroup,
				radioItem,
			},
			states: {
				value,
			},
			helpers: {
				isChecked,
			},
		};
	};

	const {
		elements: { root: separator },
	} = createSeparator({
		orientation: 'horizontal',
	});

	/* -------------------------------------------------------------------------------------------------
	 * SUBMENU
	 * -----------------------------------------------------------------------------------------------*/

	const subMenuDefaults = {
		...defaults,
		disabled: false,
		positioning: {
			placement: 'right-start',
			gutter: 8,
		},
	} satisfies Defaults<_CreateSubmenuProps>;

	const createSubmenu = (args?: _CreateSubmenuProps) => {
		const withDefaults = { ...subMenuDefaults, ...args } satisfies _CreateSubmenuProps;

		const subOpenWritable = withDefaults.open ?? writable(false);
		const subOpen = overridable(subOpenWritable, withDefaults?.onOpenChange);
		// options
		const options = toWritableStores(omit(withDefaults, 'ids'));

		const { positioning, arrowSize, disabled } = options;

		const subActiveTrigger = withGet(writable<HTMLElement | null>(null));
		const subOpenTimer = withGet(writable<number | null>(null));
		const pointerGraceTimer = withGet(writable(0));

		const subIds = toWritableStores({ ...generateIds(menuIdParts), ...withDefaults.ids });

		safeOnMount(() => {
			/**
			 * Set active trigger on mount to handle controlled/forceVisible
			 * state.
			 */
			const subTrigger = document.getElementById(subIds.trigger.get());
			if (subTrigger) {
				subActiveTrigger.set(subTrigger);
			}
		});

		const subIsVisible = derivedVisible({
			open: subOpen,
			forceVisible,
			activeTrigger: subActiveTrigger,
		});

		const subMenu = makeElement(name('submenu'), {
			stores: [subIsVisible, subIds.menu, subIds.trigger],
			returned: ([$subIsVisible, $subMenuId, $subTriggerId]) => {
				return {
					role: 'menu',
					hidden: $subIsVisible ? undefined : true,
					style: styleToString({
						display: $subIsVisible ? undefined : 'none',
					}),
					id: $subMenuId,
					'aria-labelledby': $subTriggerId,
					'data-state': $subIsVisible ? 'open' : 'closed',
					// unit tests fail on `.closest` if the id starts with a number
					// so using a data attribute
					'data-id': $subMenuId,
					tabindex: -1,
				} as const;
			},
			action: (node: HTMLElement): MeltActionReturn<MenuEvents['submenu']> => {
				let unsubPopper = noop;

				const unsubDerived = effect(
					[subIsVisible, positioning],
					([$subIsVisible, $positioning]) => {
						unsubPopper();
						if (!$subIsVisible) return;
						const activeTrigger = subActiveTrigger.get();
						if (!activeTrigger) return;
						tick().then(() => {
							const parentMenuEl = getParentMenu(activeTrigger);

							const popper = usePopper(node, {
								anchorElement: activeTrigger,
								open: subOpen,
								options: {
									floating: $positioning,
									portal: isHTMLElement(parentMenuEl) ? parentMenuEl : undefined,
									clickOutside: null,
									focusTrap: null,
									escapeKeydown: null,
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
						if (e.key === kbd.ESCAPE) {
							return;
						}

						// Submenu key events bubble through portals.
						// We only want the keys in this menu.
						const target = e.target;
						const menuEl = e.currentTarget;
						if (!isHTMLElement(target) || !isHTMLElement(menuEl)) return;

						const isKeyDownInside = target.closest('[role="menu"]') === menuEl;
						if (!isKeyDownInside) return;

						if (FIRST_LAST_KEYS.includes(e.key)) {
							// prevent events from bubbling
							e.stopImmediatePropagation();
							handleMenuNavigation(e, loop.get() ?? false);
							return;
						}

						const isCloseKey = SUB_CLOSE_KEYS['ltr'].includes(e.key);
						const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
						const isCharacterKey = e.key.length === 1;

						// close the submenu if the user presses a close key
						if (isCloseKey) {
							const $subActiveTrigger = subActiveTrigger.get();
							e.preventDefault();
							subOpen.update(() => {
								if ($subActiveTrigger) {
									handleRovingFocus($subActiveTrigger);
								}
								return false;
							});
							return;
						}

						/**
						 * Menus should not be navigated using tab, so we prevent it.
						 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within
						 */
						if (e.key === kbd.TAB) {
							e.preventDefault();
							rootOpen.set(false);
							handleTabNavigation(e, nextFocusable, prevFocusable);
							return;
						}

						if (!isModifierKey && isCharacterKey && typeahead.get() === true) {
							// typeahead logic
							handleTypeaheadSearch(e.key, getMenuItems(menuEl));
						}
					}),
					addMeltEventListener(node, 'pointermove', (e) => {
						onMenuPointerMove(e);
					}),
					addMeltEventListener(node, 'focusout', (e) => {
						const $subActiveTrigger = subActiveTrigger.get();
						if (isUsingKeyboard.get()) {
							const target = e.target;
							const submenuEl = document.getElementById(subIds.menu.get());
							if (!isHTMLElement(submenuEl) || !isHTMLElement(target)) return;

							if (!submenuEl.contains(target) && target !== $subActiveTrigger) {
								subOpen.set(false);
							}
						} else {
							const menuEl = e.currentTarget;
							const relatedTarget = e.relatedTarget;
							if (!isHTMLElement(relatedTarget) || !isHTMLElement(menuEl)) return;

							if (!menuEl.contains(relatedTarget) && relatedTarget !== $subActiveTrigger) {
								subOpen.set(false);
							}
						}
					})
				);

				return {
					destroy() {
						unsubDerived();
						unsubPopper();
						unsubEvents();
					},
				};
			},
		});

		const subTrigger = makeElement(name('subtrigger'), {
			stores: [subOpen, disabled, subIds.menu, subIds.trigger],
			returned: ([$subOpen, $disabled, $subMenuId, $subTriggerId]) => {
				return {
					role: 'menuitem',
					id: $subTriggerId,
					tabindex: -1,
					'aria-controls': $subMenuId,
					'aria-expanded': $subOpen,
					'data-state': $subOpen ? 'open' : 'closed',
					'data-disabled': disabledAttr($disabled),
					'aria-haspopop': 'menu',
				} as const;
			},
			action: (node: HTMLElement): MeltActionReturn<MenuEvents['subTrigger']> => {
				setMeltMenuAttribute(node, selector);
				applyAttrsIfDisabled(node);
				subActiveTrigger.update((p) => {
					if (p) return p;
					return node;
				});

				const unsubTimer = () => {
					clearTimerStore(subOpenTimer);
					window.clearTimeout(pointerGraceTimer.get());
					pointerGraceIntent.set(null);
				};

				const unsubEvents = executeCallbacks(
					addMeltEventListener(node, 'click', (e) => {
						if (e.defaultPrevented) return;

						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl) || isElementDisabled(triggerEl)) return;

						// Manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
						handleRovingFocus(triggerEl);
						if (!subOpen.get()) {
							subOpen.update((prev) => {
								const isAlreadyOpen = prev;
								if (!isAlreadyOpen) {
									subActiveTrigger.set(triggerEl);
									return !prev;
								}
								return prev;
							});
						}
					}),
					addMeltEventListener(node, 'keydown', (e) => {
						const $typed = typed.get();
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl) || isElementDisabled(triggerEl)) return;
						const isTypingAhead = $typed.length > 0;
						if (isTypingAhead && e.key === kbd.SPACE) return;

						if (SUB_OPEN_KEYS['ltr'].includes(e.key)) {
							if (!subOpen.get()) {
								triggerEl.click();
								e.preventDefault();
								return;
							}

							const menuId = triggerEl.getAttribute('aria-controls');
							if (!menuId) return;

							const menuEl = document.getElementById(menuId);
							if (!isHTMLElement(menuEl)) return;

							const firstItem = getMenuItems(menuEl)[0];
							handleRovingFocus(firstItem);
						}
					}),
					addMeltEventListener(node, 'pointermove', (e) => {
						if (!isMouse(e)) return;
						onItemEnter(e);

						if (e.defaultPrevented) return;

						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;
						if (!isFocusWithinSubmenu(subIds.menu.get())) {
							handleRovingFocus(triggerEl);
						}

						const openTimer = subOpenTimer.get();
						if (!subOpen.get() && !openTimer && !isElementDisabled(triggerEl)) {
							subOpenTimer.set(
								window.setTimeout(() => {
									subOpen.update(() => {
										subActiveTrigger.set(triggerEl);
										return true;
									});
									clearTimerStore(subOpenTimer);
								}, 100)
							);
						}
					}),
					addMeltEventListener(node, 'pointerleave', (e) => {
						if (!isMouse(e)) return;
						clearTimerStore(subOpenTimer);

						const submenuEl = document.getElementById(subIds.menu.get());
						const contentRect = submenuEl?.getBoundingClientRect();

						if (contentRect) {
							const side = submenuEl?.dataset.side as Side;
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

							window.clearTimeout(pointerGraceTimer.get());
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
					}),
					addMeltEventListener(node, 'focusout', (e) => {
						const triggerEl = e.currentTarget;
						if (!isHTMLElement(triggerEl)) return;

						removeHighlight(triggerEl);

						const relatedTarget = e.relatedTarget;
						if (!isHTMLElement(relatedTarget)) return;

						const menuId = triggerEl.getAttribute('aria-controls');
						if (!menuId) return;

						const menu = document.getElementById(menuId);

						if (menu && !menu.contains(relatedTarget)) {
							subOpen.set(false);
						}
					}),
					addMeltEventListener(node, 'focusin', (e) => {
						onItemFocusIn(e);
					})
				);

				return {
					destroy() {
						unsubTimer();
						unsubEvents();
					},
				};
			},
		});

		const subArrow = makeElement(name('subarrow'), {
			stores: arrowSize,
			returned: ($arrowSize) => ({
				'data-arrow': true,
				style: styleToString({
					position: 'absolute',
					width: `var(--arrow-size, ${$arrowSize}px)`,
					height: `var(--arrow-size, ${$arrowSize}px)`,
				}),
			}),
		});

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
			if (!isBrowser || $pointerGraceIntent) return;
			window.clearTimeout(pointerGraceTimer.get());
		});

		effect([subOpen], ([$subOpen]) => {
			if (!isBrowser) return;

			if ($subOpen && isUsingKeyboard.get()) {
				sleep(1).then(() => {
					const menuEl = document.getElementById(subIds.menu.get());
					if (!menuEl) return;
					const menuItems = getMenuItems(menuEl);
					if (!menuItems.length) return;
					handleRovingFocus(menuItems[0]);
				});
			}

			if (!$subOpen) {
				const focusedItem = currentFocusedItem.get();
				const subTriggerEl = document.getElementById(subIds.trigger.get());
				if (focusedItem) {
					sleep(1).then(() => {
						const menuEl = document.getElementById(subIds.menu.get());
						if (!menuEl) return;
						if (menuEl.contains(focusedItem)) {
							removeHighlight(focusedItem);
						}
					});
				}
				if (!subTriggerEl || document.activeElement === subTriggerEl) return;
				removeHighlight(subTriggerEl);
			}
		});

		return {
			ids: subIds,
			elements: {
				subTrigger,
				subMenu,
				subArrow,
			},
			states: {
				subOpen,
			},
			options,
		};
	};

	safeOnMount(() => {
		/**
		 * We need to set the active trigger on mount to cover the
		 * case where the user sets the `open` store to `true` without
		 * clicking on the trigger.
		 */
		const triggerEl = document.getElementById(rootIds.trigger.get());
		if (isHTMLElement(triggerEl) && rootOpen.get()) {
			rootActiveTrigger.set(triggerEl);
		}

		const unsubs: Array<() => void> = [];

		const handlePointer = () => isUsingKeyboard.set(false);

		const handleKeyDown = () => {
			isUsingKeyboard.set(true);
			unsubs.push(
				executeCallbacks(
					addEventListener(document, 'pointerdown', handlePointer, { capture: true, once: true }),
					addEventListener(document, 'pointermove', handlePointer, { capture: true, once: true })
				)
			);
		};

		const keydownListener = (e: KeyboardEvent) => {
			if (e.key === kbd.ESCAPE && closeOnEscape.get()) {
				rootOpen.set(false);
				return;
			}
		};
		unsubs.push(addEventListener(document, 'keydown', handleKeyDown, { capture: true }));
		unsubs.push(addEventListener(document, 'keydown', keydownListener));

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	/* -------------------------------------------------------------------------------------------------
	 * Root Effects
	 * -----------------------------------------------------------------------------------------------*/

	effect([rootOpen, currentFocusedItem], ([$rootOpen, $currentFocusedItem]) => {
		if (!$rootOpen && $currentFocusedItem) {
			removeHighlight($currentFocusedItem);
		}
	});

	effect([rootOpen], ([$rootOpen]) => {
		if (!isBrowser) return;
		if (!$rootOpen) {
			const $rootActiveTrigger = rootActiveTrigger.get();
			if (!$rootActiveTrigger) return;
			const $closeFocus = closeFocus.get();

			if (!$rootOpen && $rootActiveTrigger) {
				handleFocus({ prop: $closeFocus, defaultEl: $rootActiveTrigger });
			}
		}
	});

	effect([rootOpen, preventScroll], ([$rootOpen, $preventScroll]) => {
		if (!isBrowser) return;

		const unsubs: Array<() => void> = [];

		if (opts.removeScroll && $rootOpen && $preventScroll) {
			unsubs.push(removeScroll());
		}

		// if the menu is open, we'll sleep for a sec so the menu can render
		// before we focus on either the first item or the menu itself.
		sleep(1).then(() => {
			const menuEl = document.getElementById(rootIds.menu.get());
			if (menuEl && $rootOpen && isUsingKeyboard.get()) {
				if (disableFocusFirstItem.get()) {
					handleRovingFocus(menuEl);
					return;
				}
				// Get menu items belonging to the root menu
				const menuItems = getMenuItems(menuEl);
				if (!menuItems.length) return;

				// Focus on first menu item
				handleRovingFocus(menuItems[0]);
			}
		});

		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	});

	effect(rootOpen, ($rootOpen) => {
		if (!isBrowser) return;

		const handlePointer = () => isUsingKeyboard.set(false);
		const handleKeyDown = (e: KeyboardEvent) => {
			isUsingKeyboard.set(true);
			if (e.key === kbd.ESCAPE && $rootOpen && closeOnEscape.get()) {
				rootOpen.set(false);
				return;
			}
		};

		return executeCallbacks(
			addEventListener(document, 'pointerdown', handlePointer, { capture: true, once: true }),
			addEventListener(document, 'pointermove', handlePointer, { capture: true, once: true }),
			addEventListener(document, 'keydown', handleKeyDown, { capture: true })
		);
	});

	function handleOpen(triggerEl: HTMLElement) {
		rootOpen.update((prev) => {
			const isOpen = !prev;
			if (isOpen) {
				nextFocusable.set(getNextFocusable(triggerEl));
				prevFocusable.set(getPreviousFocusable(triggerEl));
				rootActiveTrigger.set(triggerEl);
			}

			return isOpen;
		});
	}

	/* -------------------------------------------------------------------------------------------------
	 * Pointer Event Effects
	 * -----------------------------------------------------------------------------------------------*/

	function onItemFocusIn(e: FocusEvent) {
		const itemEl = e.currentTarget;
		if (!isHTMLElement(itemEl)) return;
		const $currentFocusedItem = currentFocusedItem.get();
		if ($currentFocusedItem) {
			removeHighlight($currentFocusedItem);
		}
		addHighlight(itemEl);

		/**
		 * Accomodates for Firefox focus event behavior, which differs
		 * from other browsers. We're setting the current focused item
		 * so when we close the menu, we can remove the data-highlighted
		 * attribute from the item, since a blur nor focusout event will be fired
		 * when the menu is closed via `clickOutside` or the ESC key.
		 */
		currentFocusedItem.set(itemEl);
	}

	/**
	 * Each of the menu items share the same focusout event handler.
	 */
	function onItemFocusOut(e: FocusEvent) {
		const itemEl = e.currentTarget;
		if (!isHTMLElement(itemEl)) return;
		removeHighlight(itemEl);
	}

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

		const parentMenuEl = getParentMenu(target);
		if (!parentMenuEl) return;
		handleRovingFocus(parentMenuEl);
	}

	function onTriggerLeave(e: PointerEvent) {
		if (isPointerMovingToSubmenu(e)) {
			e.preventDefault();
		}
	}

	function onMenuPointerMove(e: PointerEvent) {
		if (!isMouse(e)) return;

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget) || !isHTMLElement(target)) return;

		const $lastPointerX = lastPointerX.get();
		const pointerXHasChanged = $lastPointerX !== e.clientX;

		// We don't use `e.movementX` for this check because Safari will
		// always return `0` on a pointer e.
		if (currentTarget.contains(target) && pointerXHasChanged) {
			const newDir = e.clientX > $lastPointerX ? 'right' : 'left';
			pointerDir.set(newDir);
			lastPointerX.set(e.clientX);
		}
	}

	function onMenuItemPointerMove(e: PointerEvent, currTarget: HTMLElement | null = null) {
		if (!isMouse(e)) return;
		onItemEnter(e);
		if (e.defaultPrevented) return;

		// if we've already checked the current target, we don't need to again
		if (currTarget) {
			handleRovingFocus(currTarget);
			return;
		}

		// otherwise we will
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;
		// focus on the current menu item
		handleRovingFocus(currentTarget);
	}

	function onMenuItemPointerLeave(e: PointerEvent) {
		if (!isMouse(e)) return;
		onItemLeave(e);
	}

	/* -------------------------------------------------------------------------------------------------
	 * Helper Functions
	 * -----------------------------------------------------------------------------------------------*/

	function onItemKeyDown(e: KeyboardEvent) {
		const $typed = typed.get();
		const isTypingAhead = $typed.length > 0;
		if (isTypingAhead && e.key === kbd.SPACE) {
			e.preventDefault();
			return;
		}
		if (SELECTION_KEYS.includes(e.key)) {
			/**
			 * We prevent default browser behaviour for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
			const itemEl = e.currentTarget;
			if (!isHTMLElement(itemEl)) return;

			itemEl.click();
		}
	}

	function isIndeterminate(checked?: boolean | 'indeterminate'): checked is 'indeterminate' {
		return checked === 'indeterminate';
	}

	function getCheckedState(checked: boolean | 'indeterminate') {
		return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked';
	}

	function isPointerMovingToSubmenu(e: PointerEvent) {
		return pointerMovingToSubmenu.get()(e);
	}

	/**
	 * Get the parent menu element for a menu item.
	 * @param element The menu item element
	 */
	function getParentMenu(element: HTMLElement): HTMLElement | null {
		const parentMenuEl = element.closest('[role="menu"]');
		if (!isHTMLElement(parentMenuEl)) return null;
		return parentMenuEl;
	}

	return {
		ids: rootIds,
		trigger: rootTrigger,
		menu: rootMenu,
		open: rootOpen,
		item,
		group,
		groupLabel,
		arrow: rootArrow,
		options: opts.rootOptions,
		createCheckboxItem,
		createSubmenu,
		createMenuRadioGroup,
		separator,
		handleTypeaheadSearch,
	};
}

export function handleTabNavigation(
	e: KeyboardEvent,
	nextFocusable: WithGet<Writable<HTMLElement | null>>,
	prevFocusable: WithGet<Writable<HTMLElement | null>>
) {
	if (e.shiftKey) {
		const $prevFocusable = prevFocusable.get();
		if ($prevFocusable) {
			e.preventDefault();
			sleep(1).then(() => $prevFocusable.focus());
			prevFocusable.set(null);
		}
	} else {
		const $nextFocusable = nextFocusable.get();
		if ($nextFocusable) {
			e.preventDefault();
			sleep(1).then(() => $nextFocusable.focus());
			nextFocusable.set(null);
		}
	}
}

/**
 * Get the menu items for a given menu element.
 * This only selects menu items that are direct children of the menu element,
 * not menu items that are nested in submenus.
 * @param element The menu item element
 */
export function getMenuItems(menuElement: HTMLElement) {
	return Array.from(menuElement.querySelectorAll(`[data-melt-menu-id="${menuElement.id}"]`)).filter(
		(item): item is HTMLElement => isHTMLElement(item)
	);
}

export function applyAttrsIfDisabled(element: HTMLElement | null) {
	if (!element || !isElementDisabled(element)) return;

	element.setAttribute('data-disabled', '');
	element.setAttribute('aria-disabled', 'true');
}

/**
 * Given a timer store, clear the timeout and set the store to null
 * @param openTimer The timer store
 */
export function clearTimerStore(timerStore: WithGet<Writable<number | null>>) {
	if (!isBrowser) return;
	const timer = timerStore.get();
	if (timer) {
		window.clearTimeout(timer);
		timerStore.set(null);
	}
}

/**
 * Check if the event is a mouse event
 * @param e The pointer event
 */
function isMouse(e: PointerEvent) {
	return e.pointerType === 'mouse';
}

/**
 * Set the `data-melt-menu-id` attribute on a menu item element.
 * @param element The menu item element
 */
export function setMeltMenuAttribute(element: HTMLElement | null, selector: Selector) {
	if (!element) return;
	const menuEl = element.closest(`${selector()}, ${selector('submenu')}`);

	if (!isHTMLElement(menuEl)) return;
	element.setAttribute('data-melt-menu-id', menuEl.id);
}

/**
 * Keyboard event handler for menu navigation
 * @param e The keyboard event
 */
export function handleMenuNavigation(e: KeyboardEvent, loop?: boolean) {
	e.preventDefault();

	// currently focused menu item
	const currentFocusedItem = document.activeElement;

	// menu element being navigated
	const currentTarget = e.currentTarget;

	if (!isHTMLElement(currentFocusedItem) || !isHTMLElement(currentTarget)) return;

	// menu items of the current menu
	const menuItems = getMenuItems(currentTarget);
	if (!menuItems.length) return;

	const candidateNodes = menuItems.filter((item) => {
		if (item.hasAttribute('data-disabled') || item.getAttribute('disabled') === 'true') {
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
			if (loop) {
				nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : 0;
			} else {
				nextIndex = currentIndex < candidateNodes.length - 1 ? currentIndex + 1 : currentIndex;
			}
			break;
		case kbd.ARROW_UP:
			if (loop) {
				nextIndex = currentIndex > 0 ? currentIndex - 1 : candidateNodes.length - 1;
			} else {
				nextIndex =
					currentIndex < 0 ? candidateNodes.length - 1 : currentIndex > 0 ? currentIndex - 1 : 0;
			}
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

export type Point = { x: number; y: number };
type Polygon = Point[];
type Side = 'left' | 'right';
type GraceIntent = { area: Polygon; side: Side };

function isPointerInGraceArea(e: PointerEvent, area?: Polygon) {
	if (!area) return false;
	const cursorPos = { x: e.clientX, y: e.clientY };
	return isPointInPolygon(cursorPos, area);
}

/**
 * Determine if a point is inside of a polygon.
 *
 * @see https://github.com/substack/point-in-polygon
 */
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

function isFocusWithinSubmenu(submenuId: string) {
	const activeEl = document.activeElement;
	if (!isHTMLElement(activeEl)) return false;
	// unit tests don't allow `.closest(#id)` to start with a number
	// so we're using a data attribute.
	const submenuEl = activeEl.closest(`[data-id="${submenuId}"]`);
	return isHTMLElement(submenuEl);
}
