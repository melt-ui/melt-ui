import type { Tabs } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Tabs',
	description: '',
	example,
	meta: {
		Root: {},
		List: {},
		Trigger: {},
		Content: {},
	},
} satisfies PreviewSchema<typeof Tabs>;
