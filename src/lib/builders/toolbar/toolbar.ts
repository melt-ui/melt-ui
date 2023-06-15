import { elementMulti } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';

type CreateToolbarArgs = {};

const defaults = {} satisfies Defaults<CreateToolbarArgs>;

export function createToolbar(args: CreateToolbarArgs) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });

	const root = {
		role: 'toolbar',
		tabindex: 0,
	};

	return {
		root,
		options,
	};
}
