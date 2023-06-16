import type { FloatingConfig } from '$lib/internal/actions';
import { usePopper } from '$lib/internal/actions/popper';
import {
	debounce,
	derivedWithUnsubscribe,
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	styleToString,
	uuid,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { createFocusTrap } from 'focus-trap';
import { derived, get, writable } from 'svelte/store';
import useFocusTrap from '../../internal/actions/focus-trap/focusTrap';

export type CreateDropdownMenuArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	selected?: string | number;
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
	const options = writable({ ...withDefaults });

	const open = writable(false);
	const selectedText = writable<string | null>(null);
	const activeTrigger = writable<HTMLElement | null>(null);
	const openSubMenus = writable<string[]>([]);

	// Pointer Grace Intent
	const pointerGraceIntent = writable<GraceIntent | null>(null);
	const pointerGraceTimer = writable(0);
	const pointerDirection = writable<Side>('left');
	const lastPointerX = writable(0);

	// Open timer
	const openTimer = writable<number | null>(null);

	// Currently Focused Item
	const focusedItem = writable<HTMLElement | null>(null);

	const ids = {
		menu: uuid(),
		trigger: uuid(),
	};

	const pointerToSubmenuStore = derivedWithUnsubscribe(
		[pointerDirection, pointerGraceIntent],
		([$pointerDirection, $pointerIntent]) => {
			return (event: PointerEvent) => {
				const isMovingTowards = $pointerDirection === $pointerIntent?.side;
				return isMovingTowards && isPointerInGraceArea(event, $pointerIntent?.area);
			};
		}
	);

	function isPointerMovingToSubmenu(event: PointerEvent) {
		return get(pointerToSubmenuStore)(event);
	}

	function isSubmenuOpen(id: string) {
		return get(openSubMenus).includes(id);
	}

	function addOpenSubmenu(id: string) {
		openSubMenus.update((prev) => [...prev, id]);
	}

	function removeOpenSubmenu(id: string) {
		openSubMenus.update((prev) => prev.filter((i) => i !== id));
	}

	function clearOpenTimer() {
		const timer = get(openTimer);
		if (timer) clearTimeout(timer);
	}

	const menu = elementDerived(
		[open, activeTrigger, options],
		([$open, $activeTrigger, $options], { addAction, attach }) => {
			if ($open && $activeTrigger) {
				addAction(usePopper, {
					anchorElement: $activeTrigger,
					open,
					options: {
						floating: $options.positioning,
						focusTrap: null,
					},
				});

				addAction(useFocusTrap);
			}

			return {
				role: 'menu',
				hidden: $open ? undefined : true,
				style: styleToString({
					display: $open ? undefined : 'none',
				}),
				id: ids.menu,
				'aria-labelledby': ids.trigger,
			};
		}
	);

	type SubMenuArgs = {
		id: string;
	};

	const subMenu = elementMultiDerived([openSubMenus], ([$openSubmenus], { addAction, attach }) => {
		return (args: SubMenuArgs) => {
			const isOpen = $openSubmenus.includes(args.id);
			let triggerId = '';

			if (isOpen) {
				const triggerEl = document.querySelector(
					`[aria-controls="${args.id}"]`
				) as HTMLElement | null;

				if (!triggerEl) return;

				triggerId = triggerEl.id;

				addAction(usePopper, {
					anchorElement: triggerEl,
					open: writable(true),
					options: {
						floating: {
							placement: 'right-start',
							gutter: 0,
							overflowPadding: 0,
						},
						focusTrap: null,
					},
				});

				addAction(useFocusTrap);
			}
			return {
				id: args.id,
				role: 'menu',
				hidden: isOpen ? undefined : true,
				style: styleToString({
					display: isOpen ? undefined : 'none',
				}),
				'aria-labelledby': triggerId,
			};
		};
	});

	const trigger = elementDerived([open, options], ([$open, $options], { attach }) => {
		attach('click', (e) => {
			e.stopPropagation();
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

		return {
			role: 'button',
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

	type ItemArgs = {
		triggerFor?: string;
		disabled?: boolean;
	};

	const itemDefaults = {
		triggerFor: '',
		disabled: false,
	} satisfies ItemArgs;

	const item = elementMultiDerived([pointerGraceTimer], ([$pointerGraceTimer], { attach }) => {
		return (args: ItemArgs = {}) => {
			const options = { ...itemDefaults, ...args };

			if (!options.triggerFor) {
				attach('click', () => {
					open.set(false);
				});

				attach('pointerenter', (e) => {
					e.stopPropagation();
					if (get(focusedItem) !== e.target) {
						focusedItem.set(e.currentTarget as HTMLElement);
					}
				});

				return {
					role: 'menuitem',
					'aria-selected': false,
					'data-selected': undefined,
					tabindex: 0,
					'aria-haspopup': undefined,
				};
			}

			attach('pointerenter', (e) => {
				e.stopImmediatePropagation();
				if (get(focusedItem) !== e.target) {
					focusedItem.set(e.currentTarget as HTMLElement);
				}

				openSubMenus.update((prev) => {
					if (options.triggerFor && !prev.includes(options.triggerFor)) {
						return [...prev, options.triggerFor];
					}
					return prev;
				});
			});

			attach('click', (e) => {
				if (!args.triggerFor) return;
				if (args.disabled || e.defaultPrevented) return;
				(e.currentTarget as HTMLElement).focus();

				if (!isSubmenuOpen(args.triggerFor)) {
					addOpenSubmenu(args.triggerFor);
				}
			});

			attach('keydown', (e) => {
				if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
					e.preventDefault();
					open.set(false);
				}
			});

			return {
				role: 'menuitem',
				'aria-selected': false,
				'data-selected': undefined,
				tabindex: 0,
				'aria-controls': options.triggerFor,
				'aria-haspopup': 'menu' as const,
			};
		};
	});

	let typed: string[] = [];
	const resetTyped = debounce(() => {
		typed = [];
	});
	effect([open, focusedItem], ([$open, $focusedItem]) => {
		if (!isBrowser) return;
		const menuObj = get(menu);
		if (!menuObj) return;
		const menuEl = getElementByMeltId(menuObj['data-melt-id']);
		if (!menuEl) return;
		if ($focusedItem) {
			$focusedItem.focus();
			createFocusTrap(menuEl, {
				onActivate: () => {
					$focusedItem?.focus();
				},
			});
		}
	});

	effect([open, menu, activeTrigger], ([$open, $menu, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open) {
			openSubMenus.set([]);
		}

		// const menuEl = getElementByMeltId($menu['data-melt-id']);
		// if (menuEl && $open) {
		// 	// Focus on selected option or first option
		// 	// const selectedOption = menuEl.querySelector('[data-selected]') as HTMLElement | undefined;
		// 	// if (!selectedOption) {
		// 	// 	const firstOption = menuEl.querySelector('[role="menuitem"]') as HTMLElement | undefined;
		// 	// 	sleep(1).then(() => firstOption?.focus());
		// 	// } else {
		// 	// 	sleep(1).then(() => selectedOption.focus());
		// 	// }

		// 	const keydownListener = (e: KeyboardEvent) => {
		// 		if (e.key === kbd.ESCAPE) {
		// 			open.set(false);
		// 			activeTrigger.set(null);
		// 			return;
		// 		}

		// 		const allOptions = Array.from(
		// 			menuEl.querySelectorAll('[role="menuitem"]')
		// 		) as HTMLElement[];

		// 		const focusedOption = allOptions.find((el) => el === document.activeElement);
		// 		const focusedIndex = allOptions.indexOf(focusedOption as HTMLElement);

		// 		if (e.key === kbd.ARROW_DOWN) {
		// 			e.preventDefault();
		// 			const nextIndex = focusedIndex + 1 > allOptions.length - 1 ? 0 : focusedIndex + 1;
		// 			const nextOption = allOptions[nextIndex] as HTMLElement;
		// 			nextOption.focus();
		// 			return;
		// 		} else if (e.key === kbd.ARROW_UP) {
		// 			e.preventDefault();
		// 			const prevIndex = focusedIndex - 1 < 0 ? allOptions.length - 1 : focusedIndex - 1;
		// 			const prevOption = allOptions[prevIndex] as HTMLElement;
		// 			prevOption.focus();
		// 			return;
		// 		} else if (e.key === kbd.HOME) {
		// 			e.preventDefault();
		// 			const firstOption = allOptions[0] as HTMLElement;
		// 			firstOption.focus();
		// 			return;
		// 		} else if (e.key === kbd.END) {
		// 			e.preventDefault();
		// 			const lastOption = allOptions[allOptions.length - 1] as HTMLElement;
		// 			lastOption.focus();
		// 			return;
		// 		}

		// 		// Typeahead
		// 		const isAlphaNumericOrSpace = /^[a-z0-9 ]$/i.test(e.key);
		// 		if (isAlphaNumericOrSpace) {
		// 			typed.push(e.key.toLowerCase());
		// 			const typedString = typed.join('');
		// 			const matchingOption = allOptions.find((el) =>
		// 				el.innerText.toLowerCase().startsWith(typedString)
		// 			);
		// 			if (matchingOption) {
		// 				matchingOption.focus();
		// 			}

		// 			resetTyped();
		// 		}
		// 	};

		// 	document.addEventListener('keydown', keydownListener);
		// 	return () => {
		// 		document.removeEventListener('keydown', keydownListener);
		// 	};
		// } else if (!$open && $activeTrigger && isBrowser) {
		// 	// Hacky way to prevent the keydown event from triggering on the trigger
		// 	sleep(1).then(() => $activeTrigger.focus());
		// }
	});

	return { trigger, menu, open, item, subMenu, arrow, options };
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

function isPointerInGraceArea(event: PointerEvent, area?: Polygon) {
	if (!area) return false;
	const cursorPos = { x: event.clientX, y: event.clientY };
	return isPointInPolygon(cursorPos, area);
}
