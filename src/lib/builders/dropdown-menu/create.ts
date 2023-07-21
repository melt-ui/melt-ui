import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu';
import type { CreateDropdownMenuProps } from './types';
import { toWritableStores } from '@melt-ui/svelte/internal/helpers';

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
	preventScroll: true,
	loop: false,
	dir: 'ltr',
} satisfies Defaults<CreateDropdownMenuProps>;

export function createDropdownMenu(props?: CreateDropdownMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDropdownMenuProps;

	const rootOptions = toWritableStores(withDefaults);

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
