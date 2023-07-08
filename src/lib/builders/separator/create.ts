import { builder } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import type { CreateSeparatorArgs } from './types';

const defaults = {
	orientation: 'horizontal',
	decorative: false,
} satisfies Defaults<CreateSeparatorArgs>;

export const createSeparator = (args: CreateSeparatorArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });

	const root = builder('separator', {
		stores: options,
		returned: ({ orientation, decorative }) => {
			const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
			return {
				role: decorative ? 'none' : 'separator',
				'aria-orientation': ariaOrientation,
				'aria-hidden': decorative,
				'data-orientation': orientation,
			};
		},
	});

	return {
		root,
		options,
	};
};
