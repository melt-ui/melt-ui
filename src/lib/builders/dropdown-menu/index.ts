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
	const options = writable(omit(withDefaults, 'selected'));

	const open = writable(false);
	const selected = writable(withDefaults.selected ?? null);
	const selectedText = writable<string | number | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		menu: uuid(),
		trigger: uuid(),
	};

	const menu = elementDerived(
		[open, activeTrigger, options],
		([$open, $activeTrigger, $options], { addAction }) => {
			if ($open && $activeTrigger) {
				addAction(usePopper, {
					anchorElement: $activeTrigger,
					open,
					options: {
						floating: $options.positioning,
						clickOutside: {
							ignore: (e) => {
								const target = e.target as HTMLElement;
								if (target.closest(`[data-submenu]`)) {
									return true;
								}
								return false;
							},
						},
					},
				});
			}

			return {
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
			};
		}
	);

	const trigger = elementDerived([open, options], ([$open, $options], { attach }) => {
		attach('click', (e) => {
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

		attach('pointerover', (e) => {
			const triggerEl = e.currentTarget as HTMLElement;
			triggerEl.focus();
		});

		return {
			role: 'menu',
			'aria-controls': ids.menu,
			'aria-expanded': $open,
			'aria-required': $options.required,
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $options.disabled ? '' : undefined,
			id: ids.trigger,
		};
	});

	const arrow = derived(options, ($options) => ({
		'data-arrow': true,
		style: styleToString({
			position: 'absolute',
			width: `var(--arrow-size, ${$options.arrowSize}px)`,
			height: `var(--arrow-size, ${$options.arrowSize}px)`,
		}),
	}));

	const item = elementMultiDerived([selected, menu], ([$selected, $menu], { attach }) => {
		return () => {
			attach('keydown', (e) => {
				console.log(e);
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
				'data-melt-menu': $menu.id,
				tabindex: -1,
			};
		};
	});

	effect([open, menu, activeTrigger], ([$open, $menu, $activeTrigger]) => {
		if (!isBrowser) return;

		const menuEl = getElementByMeltId($menu['data-melt-id']);
		if (menuEl && $open) {
			// Selector to get menu items belonging to menu
			const itemSelector = `[role="menuitem"][data-melt-menu="${$menu.id}"]`;

			// Focus on first menu item
			const firstOption = document.querySelector(itemSelector) as HTMLElement | undefined;
			sleep(1).then(() => firstOption?.focus());

			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === kbd.ESCAPE) {
					open.set(false);
					activeTrigger.set(null);
					return;
				}

				const allOptions = Array.from(menuEl.querySelectorAll('[role="option"]')) as HTMLElement[];
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
		} else if (!$open && $activeTrigger && isBrowser) {
			// Hacky way to prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return { trigger, menu, open, item, selected, selectedText, arrow, options };
}

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
				'data-submenu': true,
			};
		}
	);

	const subTrigger = elementDerived([open, options], ([$open, $options], { attach }) => {
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

		return {
			role: 'menuitem',
			'aria-controls': ids.menu,
			'aria-expanded': $open,
			'aria-required': $options.required,
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': $options.disabled ? '' : undefined,
			id: ids.trigger,
			tabindex: -1,
		};
	});

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
