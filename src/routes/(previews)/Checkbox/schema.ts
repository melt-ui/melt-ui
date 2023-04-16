import type { Checkbox } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Checkbox',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	code,
	meta: {
		Root: {
			props: {
				checked: {
					type: 'boolean',
					default: false,
				},
				disabled: {
					type: 'boolean',
				},
				required: {
					type: 'boolean',
					show: null,
				},
				name: {
					type: 'string',
					show: null,
				},
				value: {
					type: 'string',
					show: null,
				},
			},
			dataAttributes: {
				'data-disabled': {
					values: ['true', 'false'],
				},
				'data-state': {
					values: ['checked', 'unchecked', 'indeterminate'],
				},
			},
		},
		Indicator: {},
	},
} satisfies PreviewSchema<typeof Checkbox>;
