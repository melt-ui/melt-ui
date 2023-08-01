import {
	builder,
	createElHelpers,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { readonly, writable } from 'svelte/store';
import type { CreateProgressProps } from './types';

const defaults = {
	defaultValue: 0,
	max: 100,
} satisfies Defaults<CreateProgressProps>;

const { name } = createElHelpers('progress');

export const createProgress = (props?: CreateProgressProps) => {
	const withDefaults = { ...defaults, ...props } satisfies CreateProgressProps;

	const options = toWritableStores(omit(withDefaults, 'value'));
	const { max } = options;
	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

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
			value: readonly(value),
		},
		options,
	};
};
