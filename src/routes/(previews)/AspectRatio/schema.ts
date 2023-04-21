import type { AspectRatio } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Aspect Ratio',
	description: 'Displays content within a desired ratio.',
	example,
	code,
	meta: {
		Root: {
			props: {
				ratio: {
					type: 'number',
					default: 1.75,
				},
			},
		},
	},
} satisfies PreviewSchema<typeof AspectRatio>;
