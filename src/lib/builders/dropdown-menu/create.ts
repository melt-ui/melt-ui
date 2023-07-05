import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu';
import type { CreateDropdownMenu } from './types';

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
		selector: 'dropdown-menu',
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
