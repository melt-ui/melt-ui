import { overridable, toWritableStores } from '$lib/internal/helpers/index.js';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu/index.js';
import type { CreateDropdownMenuProps } from './types.js';

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
	forceVisible: false,
	typeahead: true,
	closeFocus: undefined,
	disableFocusFirstItem: false,
} satisfies CreateDropdownMenuProps;

export function createDropdownMenu(props?: CreateDropdownMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDropdownMenuProps;

	const rootOptions = toWritableStores(withDefaults);

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const rootOpen = overridable(openWritable, withDefaults?.onOpenChange);

	const rootActiveTrigger = writable<HTMLElement | null>(null);
	const nextFocusable = writable<HTMLElement | null>(null);
	const prevFocusable = writable<HTMLElement | null>(null);

	const {
		trigger,
		menu,
		item,
		arrow,
		createSubmenu,
		createCheckboxItem,
		createMenuRadioGroup,
		separator,
		group,
		groupLabel,
		ids,
	} = createMenuBuilder({
		rootOptions,
		rootOpen,
		rootActiveTrigger,
		nextFocusable,
		prevFocusable,
		selector: 'dropdown-menu',
		removeScroll: true,
	});

	return {
		ids,
		elements: {
			trigger,
			menu,
			item,
			arrow,
			separator,
			group,
			groupLabel,
		},
		states: {
			open: rootOpen,
		},
		builders: {
			createCheckboxItem,
			createSubmenu,
			createMenuRadioGroup,
		},
		options: rootOptions,
	};
}
