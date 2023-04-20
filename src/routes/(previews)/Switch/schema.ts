import type { Switch } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Switch',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	code,
	meta: {
		Root: {
			props: {
				checked: { type: 'boolean' },
				required: { type: 'boolean' },
				disabled: { type: 'boolean' },
				name: { type: 'string', show: null },
				value: { type: 'string', show: null },
			},
		},
		Thumb: {},
	},
} satisfies PreviewSchema<typeof Switch>;
