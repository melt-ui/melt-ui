import type { Label } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Label',
	description: 'Renders an accessible label associated with controls.',
	example,
	code,
	meta: {
		Root: {
			props: {
				onMouseDown: {
					type: 'function',
					default: undefined,
					show: null,
				},
				ref: {
					type: 'HTMLLabelElement',
					default: undefined,
					show: null,
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Label>;
