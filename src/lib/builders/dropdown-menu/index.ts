import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder, type Menu } from '../menu';

export type DropdownMenuArgs = Menu['builder'];
export type DropdownMenuSubArgs = Menu['submenu'];
export type DropdownMenuItemArgs = Menu['item'];
export type DropdownMenuCheckboxItemArgs = Menu['checkboxItem'];
export type DropdownMenuRadioGroup = Menu['radioGroup'];
export type DropdownMenuRadioItemArgs = Menu['radioItem'];
export type DropdownMenuRadioItemActionArgs = Menu['radioItemAction'];

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
} satisfies Defaults<DropdownMenuArgs>;

export function createDropdownMenu(args?: DropdownMenuArgs) {
	const withDefaults = { ...defaults, ...args } as DropdownMenuArgs;
	const rootOptions = writable(withDefaults);
	const rootOpen = writable(false);
	const rootActiveTrigger = writable<HTMLElement | null>(null);

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
