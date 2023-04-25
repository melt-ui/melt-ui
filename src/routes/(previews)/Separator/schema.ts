import type { Separator } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Separator',
	description: 'Visually or semantically separates content.',
	example,
	code,
	meta: {
		Root: {
			/*
			props: {
				orientation: { 
					type: "enum",
					options: ["horizontal", "vertical"],
					default: "horizontal",
					show: null
				},
				decorative: { type: 'boolean', show: null },
			}, */
		},
	},
} satisfies PreviewSchema<typeof Separator>;
