import type { Defaults } from '$lib/internal/types';
import { builder, createElHelpers } from '@melt-ui/svelte/internal/helpers';
import { writable } from 'svelte/store';
import type { CreateProgressArgs } from './types';

const defaults = {
	max: 100,
} satisfies Defaults<CreateProgressArgs>;

const { name } = createElHelpers('progress');

export const createProgress = (args: CreateProgressArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const value = writable(withDefaults.value ?? null);
	const max = writable(withDefaults.max);

	const root = builder(name(), {
		stores: [value, max],
		returned: ([$value, $max]) => {
			return {
				value: $value,
				max: $max,
				role: 'meter',
				'aria-valuemin': 0,
				'aria-valuemax': $max,
				'aria-valuenow': $value,
				'data-value': $value,
				'data-state': $value === null ? 'indeterminate' : $value === $max ? 'complete' : 'loading',
				'data-max': $max,
			};
		},
	});

	return {
		value,
		max,
		root,
		progress: root,
	};
};
