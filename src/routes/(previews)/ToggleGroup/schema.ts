import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';
import type { ToggleGroup } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'ToggleGroup',
	description: 'A set of two-state buttons that can be toggled on or off.',
	example,
	code,
	meta: {
		Root: {
			props: {
				type: {
					type: 'enum',
					options: ['single', 'multiple'],
					default: 'single',
				},
				value: {
					type: 'string',
					show: 'value',
				},
			},
		},
		Item: {},
	},
} satisfies PreviewSchema<typeof ToggleGroup>;
