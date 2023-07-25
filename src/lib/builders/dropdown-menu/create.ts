import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu';
import type { CreateDropdownMenuProps } from './types';
import { overridable, toWritableStores } from '$lib/internal/helpers';

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	portal: true,
	loop: false,
	dir: 'ltr',
	defaultOpen: false,
} satisfies Defaults<CreateDropdownMenuProps>;

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
		checkboxItem,
		arrow,
		createSubmenu,
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
		elements: {
			trigger,
			menu,
			item,
			checkboxItem,
			arrow,
			separator,
		},
		states: {
			open: rootOpen,
		},
		builders: {
			createSubmenu,
			createMenuRadioGroup,
		},
		options: rootOptions,
	};
}
