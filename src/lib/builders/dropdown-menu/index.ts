import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder, type Menu } from '../menu';

export type CreateDropdownMenu = Menu['builder'];
export type CreateDropdownMenuSub = Menu['submenu'];
export type DropdownMenuItemArgs = Menu['item'];
export type DropdownMenuCheckboxItemArgs = Menu['checkboxItem'];
export type CreateDropdownMenuRadioGroup = Menu['radioGroup'];
export type DropdownMenuRadioItemArgs = Menu['radioItem'];
export type DropdownMenuRadioItemActionArgs = Menu['radioItemAction'];

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
	preventScroll: true,
} satisfies Defaults<CreateDropdownMenu>;

export function createDropdownMenu(args?: CreateDropdownMenu) {
	const withDefaults = { ...defaults, ...args } as CreateDropdownMenu;
	const rootOptions = writable(withDefaults);
	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const {
		trigger,
		menu,
		item,
		checkboxItem,
		arrow,
		createSubMenu,
		createMenuRadioGroup,
		separator,
	} = createMenuBuilder({
		rootOptions,
		rootOpen,
		rootActiveTrigger,
		nextFocusable,
		prevFocusable,
		disableTriggerRefocus: true,
	});

	return {
		trigger,
		menu,
		open: rootOpen,
		item,
		checkboxItem,
		arrow,
		options: rootOptions,
		createSubMenu,
		createMenuRadioGroup,
		separator,
	};
}
