import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { Toggle } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Toggle',
	description: 'A two-state button that can be either on or off.',
	example,
	code,
	meta: {
		Root: {
			props: {
				pressed: {
					type: 'boolean',
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Toggle>;
