import type { Defaults } from '$lib/internal/types';
import { builder, createElHelpers, omit, toWritableStores } from '@melt-ui/svelte/internal/helpers';
import { writable } from 'svelte/store';
import type { CreateProgressProps } from './types';

const defaults = {
	max: 100,
} satisfies Defaults<CreateProgressProps>;

const { name } = createElHelpers('progress');

export const createProgress = (props?: CreateProgressProps) => {
	const withDefaults = { ...defaults, ...props } satisfies CreateProgressProps;

	const options = toWritableStores(omit(withDefaults, 'value'));
	const { max } = options;
	const value = writable(withDefaults.value ?? null);

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
		elements: {
			root,
		},
		states: {
			value,
		},
		options,
	};
};
