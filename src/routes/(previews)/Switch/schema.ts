import type { Switch } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Switch',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	meta: {
		Root: {
			props: {
				checked: { type: 'boolean' },
				required: { type: 'boolean' },
				disabled: { type: 'boolean' },
				name: { type: 'string', show: null },
				value: { type: 'string', show: null }
			}
		},
		Thumb: {}
	}
} satisfies PreviewSchema<typeof Switch>;
