import type { Avatar } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Avatar',
	description: 'An image element with a fallback for representing the user.',
	example,
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
