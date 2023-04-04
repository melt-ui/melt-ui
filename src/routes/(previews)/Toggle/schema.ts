import example from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { Toggle } from '$lib';

export const schema = {
	title: 'Toggle',
	description: 'A two-state button that can be either on or off.',
	example,
	meta: {
		Root: {
			props: {
				pressed: {
					type: 'boolean'
				}
			}
		}
	}
} satisfies PreviewSchema<typeof Toggle>;
