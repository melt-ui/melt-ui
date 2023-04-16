import type { Collapsible } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Collapsible',
	description: 'An interactive component which expands/collapses a panel.',
	example,
	code,
	meta: {
		Root: {
			props: {
				open: {
					type: 'boolean',
				},
				disabled: {
					type: 'boolean',
				},
			},
		},
		Trigger: {},
		Content: {
			props: {
				transition: {
					type: 'boolean',
					default: false,
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Collapsible>;
