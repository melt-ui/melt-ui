import type { Progress } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Progress',
	description:
		'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
	example,
	code,
	meta: {
		Root: {
			props: {
				value: {
					type: 'number',
					show: 'controls',
					default: 40,
				},
				max: {
					type: 'number',
					show: 'controls',
					default: 100,
				},
			},
			dataAttributes: {
				'data-value': {
					values: 'number',
				},
				'data-state': {
					values: ['complete', 'indeterminate', 'loading'],
				},
				'data-max': {
					values: 'number',
				},
			},
		},
		Indicator: {},
	},
} satisfies PreviewSchema<typeof Progress>;
