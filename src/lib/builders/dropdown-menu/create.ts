import { overridable, toWritableStores } from '$lib/internal/helpers/index.js';
import { writable } from 'svelte/store';
import { createMenuBuilder } from '../menu/index.js';
import type { CreateDropdownMenuProps } from './types.js';
import { omit } from '../../internal/helpers/object';
import { withGet } from '$lib/internal/helpers/withGet.js';

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
	closeOnItemClick: true,
	onOutsideClick: undefined,
} satisfies CreateDropdownMenuProps;

export function createDropdownMenu(props?: CreateDropdownMenuProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateDropdownMenuProps;

	const rootOptions = toWritableStores(omit(withDefaults, 'ids'));

	const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
	const rootOpen = overridable(openWritable, withDefaults?.onOpenChange);

	const rootActiveTrigger = withGet(writable<HTMLElement | null>(null));
	const nextFocusable = withGet(writable<HTMLElement | null>(null));
	const prevFocusable = withGet(writable<HTMLElement | null>(null));

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
		rootActiveTrigger: withGet(rootActiveTrigger),
		nextFocusable: withGet(nextFocusable),
		prevFocusable: withGet(prevFocusable),
		selector: 'dropdown-menu',
		removeScroll: true,
		ids: withDefaults.ids,
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
