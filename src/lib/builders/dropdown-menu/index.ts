import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	debounce,
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

			attach('pointerover', (e) => {
				const triggerEl = e.currentTarget as HTMLElement;
				triggerEl.focus();
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

	const item = elementMultiDerived([rootMenu], ([$rootMenu], { attach }) => {
		return () => {
			attach('keydown', (e) => {
				if (e.shiftKey && e.key === kbd.TAB) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
				if (e.key === kbd.ENTER || e.key === kbd.SPACE || e.key === kbd.TAB) {
					e.preventDefault();
				}
			});

			attach('mousemove', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.focus();
			});

			attach('mouseout', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.blur();
			});

			return {
				role: 'menuitem',
				'data-melt-menu': $rootMenu.id,
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
	} satisfies Defaults<CreateSubMenuArgs>;

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
			([$subOpen, $activeTrigger, $subOptions], { addAction }) => {
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
			([$subOpen, $subOptions], { attach }) => {
				attach('click', (e) => {
					e.stopPropagation();
					e.preventDefault();
				});

				attach('keydown', (e) => {
					if (TRIGGER_OPEN_KEYS.includes(e.key)) {
						e.preventDefault();
						const triggerEl = e.currentTarget as HTMLElement;
						subOpen.update((prev) => {
							const isOpen = !prev;
							if (isOpen) {
								subActiveTrigger.set(triggerEl);
							} else {
								subActiveTrigger.set(null);
							}

							return isOpen;
						});
					}
				});

				attach('mouseover', (e) => {
					const triggerEl = e.currentTarget as HTMLElement;

					subOpen.update((prev) => {
						const isOpen = prev;
						if (!isOpen) {
							subActiveTrigger.set(triggerEl);
							return !prev;
						}
						return prev;
					});
				});

				attach('mouseout', (e) => {
					(e.currentTarget as HTMLElement).blur();
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
					'data-melt-menu': rootIds.menu,
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
			const allItemsSelector = `[role="menuitem"][data-melt-menu="${$rootMenu.id}"]`;

			const menuItemSelector = '[role="menuitem"]';

			// Focus on first menu item
			const firstOption = document.querySelector(allItemsSelector) as HTMLElement | undefined;
			sleep(1).then(() => firstOption?.focus());

			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === kbd.ESCAPE) {
					rootOpen.set(false);
					rootActiveTrigger.set(null);
					return;
				}

				const allOptions = Array.from(menuEl.querySelectorAll(allItemsSelector)) as HTMLElement[];
				const focusedOption = allOptions.find((el) => el === document.activeElement);
				const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

				if (e.key === kbd.ARROW_DOWN) {
					e.preventDefault();
					const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
					const nextOption = allOptions[nextIndex] as HTMLElement;
					nextOption.focus();
					return;
				} else if (e.key === kbd.ARROW_UP) {
					e.preventDefault();
					const prevIndex = focusedIndex - 1 < 0 ? allOptions.length - 1 : focusedIndex - 1;
					const prevOption = allOptions[prevIndex] as HTMLElement;
					prevOption.focus();
					return;
				} else if (e.key === kbd.HOME) {
					e.preventDefault();
					const firstOption = allOptions[0] as HTMLElement;
					firstOption.focus();
					return;
				} else if (e.key === kbd.END) {
					e.preventDefault();
					const lastOption = allOptions[allOptions.length - 1] as HTMLElement;
					lastOption.focus();
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

/**
 *
 *  Remove below after build return is done
 *
 */

const TRIGGER_OPEN_KEYS = [kbd.ENTER, kbd.SPACE, kbd.ARROW_RIGHT];

export type CreateSubMenuArgs = CreateDropdownMenuArgs & {
	parentOpen: Writable<boolean>;
};

const subDefaults = {
	arrowSize: 8,
	required: false,
	disabled: false,
	positioning: {
		placement: 'right-start',
	},
	parentOpen: writable(false),
} satisfies CreateSubMenuArgs;

export function createSubMenu(args?: CreateSubMenuArgs) {
	const withDefaults = { ...subDefaults, ...args } as CreateSubMenuArgs;
	const options = writable(omit(withDefaults, 'selected'));

	const { parentOpen } = withDefaults;
	const open = writable(false);
	const selected = writable(withDefaults.selected ?? null);
	const selectedText = writable<string | number | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		menu: uuid(),
		trigger: uuid(),
	};

	const subMenu = elementDerived(
		[open, activeTrigger, options],
		([$open, $activeTrigger, $options], { addAction }) => {
			if ($open && $activeTrigger) {
				addAction(usePopper, {
					anchorElement: $activeTrigger,
					open,
					options: {
						floating: $options.positioning,
						clickOutside: null,
					},
				});
			}

			return {
				role: 'menu',
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
				'data-melt-part': 'menu-sub',
			};
		}
	);

	const subTrigger = elementDerived(
		[open, options],
		([$open, $options], { attach, getElement }) => {
			attach('pointerdown', (e) => {
				e.stopImmediatePropagation();
			});
			attach('click', (e) => {
				e.stopPropagation();
				e.preventDefault();

				const triggerEl = e.currentTarget as HTMLElement;
				open.update((prev) => {
					const isOpen = !prev;
					if (isOpen) {
						activeTrigger.set(triggerEl);
					} else {
						activeTrigger.set(null);
					}

					return isOpen;
				});
			});

			attach('keydown', (e) => {
				if (TRIGGER_OPEN_KEYS.includes(e.key)) {
					e.preventDefault();
					const triggerEl = e.currentTarget as HTMLElement;
					open.update((prev) => {
						const isOpen = !prev;
						if (isOpen) {
							activeTrigger.set(triggerEl);
						} else {
							activeTrigger.set(null);
						}

						return isOpen;
					});
				}
			});

			attach('mouseover', (e) => {
				const triggerEl = e.currentTarget as HTMLElement;

				open.update((prev) => {
					const isOpen = prev;
					if (!isOpen) {
						activeTrigger.set(triggerEl);
						return !prev;
					}
					return prev;
				});
			});

			attach('mouseout', (e) => {
				const el = e.currentTarget as HTMLElement;
				el.blur();
			});

			/**
			 * To set the `data-melt-menu` attribute on this trigger item, we
			 * need to find the root menu. We need this attribute to be set so
			 * these items are considered for keyboard navigation.
			 */
			getElement().then((el) => {
				if (!el) return;
				/**
				 * Get the trigger's parent menu.
				 * NOTE: This is not the menu that the trigger opens, but the
				 * menu that the trigger `menuitem` is a part of.
				 */
				const parentMenu = el.closest(
					'[data-melt-part="menu-root"], [data-melt-part="menu-sub"]'
				) as HTMLElement | null;
				if (!parentMenu) return;

				const parentMenuPart = parentMenu.getAttribute('data-melt-part');

				if (parentMenuPart === 'menu-root') {
					/**
					 * If the parent menu is a root menu, then we set the
					 * `data-melt-menu` property of the trigger to the
					 * parent menu's ID
					 */
					el.setAttribute('data-melt-menu', parentMenu.id);
				} else {
					/**
					 * Otherwise, we'll loop through the parent menu's siblings to find
					 * the closest root menu.
					 */
					let sibling: HTMLElement | null = parentMenu;
					while (sibling) {
						const siblingPart = sibling.getAttribute('data-melt-part');
						if (siblingPart === 'menu-root') {
							el.setAttribute('data-melt-menu', sibling.id);
							break;
						}
						sibling = sibling.previousElementSibling as HTMLElement | null;
					}
				}
			});

			return {
				role: 'menuitem',
				id: ids.trigger,
				tabindex: -1,
				'aria-controls': ids.menu,
				'aria-expanded': $open,
				'aria-required': $options.required,
				'data-state': $open ? 'open' : 'closed',
				'data-disabled': $options.disabled ? '' : undefined,
				'data-melt-part': 'menu-sub-trigger',
			};
		}
	);

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	effect([parentOpen], ([$parentOpen]) => {
		if (!$parentOpen) {
			open.set(false);
			activeTrigger.set(null);
		}
	});

	// effect([open], ([$open]) => {});

	return {
		subTrigger,
		subMenu,
		open,
		selected,
		selectedText,
		arrow,
		options,
	};
}
