import type { Progress } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Progress',
	description:
		'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
	example,
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
					values: ['0', '40', '100'],
				},
				'data-state': {
					values: ['complete', 'indeterminate', 'loading'],
				},
				'data-max': {
					values: ['100'],
				},
			},
		},
		Indicator: {},
	},
} satisfies PreviewSchema<typeof Progress>;
