import type { Avatar } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Avatar',
	description: 'An image element with a fallback for representing the user.',
	example,
	code,
	meta: {
		Root: {},
		Image: {
			props: {
				src: {
					type: 'string',
					default: 'https://avatars.githubusercontent.com/u/26071571',
				},
				alt: {
					type: 'string',
					default: 'Thomas G. Lopes',
				},
			},
			events: {
				loadingStatusChange: {
					payload: ['loading', 'loaded', 'error', 'idle'],
				},
			},
		},
		Fallback: {
			props: {
				delayMs: {
					type: 'number',
					default: 0,
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Avatar>;
