import type { AspectRatio } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Aspect Ratio',
	description: 'Displays content within a desired ratio.',
	example,
	meta: {
		Root: {
			props: {
				ratio: {
					type: 'number',
					default: 1.75
				}
			}
		}
	}
} satisfies PreviewSchema<typeof AspectRatio>;
