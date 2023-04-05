import example from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { Slider } from '$lib';

export const schema = {
	title: 'Slider',
	description: 'An input where the user selects a value from within a given range.',
	example,
	meta: {
		Root: {
			value: {
				type: 'number',
				show: 'value'
			}
		}
	}
} satisfies PreviewSchema<typeof Slider>;
