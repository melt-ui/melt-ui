import {
	createElHelpers,
	makeElement
} from '$lib/internal/helpers/index.js';
import { parseProps } from '$lib/internal/helpers/props.js';
import type { Defaults } from '$lib/internal/types.js';
import type { CreateProgressProps } from './types.js';

const defaults = {
	value: 0,
	max: 100,
} satisfies Defaults<CreateProgressProps>;

const { name } = createElHelpers('progress');

export const createProgress = (props?: CreateProgressProps) => {
	const { value, ...options } = parseProps(props, defaults);
	const { max } = options;

	const root = makeElement(name(), {
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
