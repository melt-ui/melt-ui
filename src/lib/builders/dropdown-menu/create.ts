import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu';
import type { CreateDropdownMenuProps } from './types';

const defaults = {
	arrowSize: 8,
	positioning: {
		placement: 'bottom',
	},
	preventScroll: true,
} satisfies Defaults<CreateDropdownMenuProps>;

export function createDropdownMenu(props?: CreateDropdownMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDropdownMenuProps;

	const positioning = writable<FloatingConfig>(withDefaults.positioning);
	const preventScroll = writable<boolean>(withDefaults.preventScroll);
	const arrowSize = writable<number>(withDefaults.arrowSize);
	const loop = writable<boolean>(withDefaults.loop);
	const dir = writable(withDefaults.dir);

	const rootOptions = {
		positioning,
		preventScroll,
		arrowSize,
		loop,
		dir,
	};

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
			createSubMenu,
			createMenuRadioGroup,
		},
		options: rootOptions,
	};
}
