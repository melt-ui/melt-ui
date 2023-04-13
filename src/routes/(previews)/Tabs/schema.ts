import type { Tabs } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Tabs',
	description: '',
	example,
	meta: {
		Root: {
			props: {
				activateOn: {
					type: 'enum',
					options: ['click', 'focus'],
					default: 'focus',
				},
				orientation: {
					type: 'enum',
					options: ['horizontal', 'vertical'],
					default: 'horizontal',
				},
				dir: {
					type: 'enum',
					options: ['ltr', 'rtl'],
					default: 'ltr',
				},
			},
		},
		List: {},
		Trigger: {},
		Content: {},
	},
} satisfies PreviewSchema<typeof Tabs>;
