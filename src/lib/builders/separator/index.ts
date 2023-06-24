import type { Defaults, Orientation } from '$lib/internal/types';
import { derived, writable } from 'svelte/store';

export type CreateSeparatorArgs = {
	/*
	 * The orientation of the separator.
	 * @default 'horizontal'
	 */
	orientation?: Orientation;

	/*
	 * Whether the separator is decorative or not.
	 * @default false
	 */
	decorative?: boolean;
};

const defaults = {
	orientation: 'horizontal',
	decorative: false,
} satisfies Defaults<CreateSeparatorArgs>;

export const createSeparator = (args: CreateSeparatorArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const orientation = writable(withDefaults.orientation);
	const decorative = writable(withDefaults.decorative);

	const root = derived([orientation, decorative], ([$orientation, $decorative]) => {
		const ariaOrientation = $orientation === 'vertical' ? $orientation : undefined;
		return {
			role: $decorative ? 'none' : 'separator',
			'aria-orientation': ariaOrientation,
			'aria-hidden': $decorative,
			'data-orientation': $orientation,
		};
	});

	return {
		separator: root,
	};
};
