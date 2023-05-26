import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { Tooltip } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Tooltip',
	description: 'TODO: Add description',
	example,
	code,
	meta: {
		Provider: {},
		Root: {
			props: {
				open: {
					default: false,
					type: 'boolean',
				},
			},
		},
		Trigger: {},
		Portal: {},
		Content: {},
		Arrow: {},
	},
} satisfies PreviewSchema<typeof Tooltip>;
