import { builder } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';
import type { CreateSeparatorProps } from './types';

const defaults = {
	orientation: 'horizontal',
	decorative: false,
} satisfies Defaults<CreateSeparatorProps>;

export const createSeparator = (props: CreateSeparatorProps = defaults) => {
	const withDefaults = { ...defaults, ...props };
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
