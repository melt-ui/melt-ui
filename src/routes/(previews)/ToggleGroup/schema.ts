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
				dir: {
					type: 'enum',
					options: ['ltr', 'rtl'],
					default: 'ltr',
				},
				orientation: {
					type: 'enum',
					options: ['horizontal', 'vertical'],
					default: 'horizontal',
				},
			},
			dataAttributes: {
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
			},
		},
		Item: {
			props: {
				value: {
					type: 'string',
					show: null,
				},
				disabled: {
					type: 'boolean',
					default: false,
					show: 'value',
				},
			},
			dataAttributes: {
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
				'data-state': {
					values: ['on', 'off'],
				},
				'data-disabled': {
					values: ['true', 'false'],
				},
			},
		},
	},
} satisfies PreviewSchema<typeof ToggleGroup>;
