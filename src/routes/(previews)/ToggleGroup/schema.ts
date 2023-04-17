import example from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { ToggleGroup } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'ToggleGroup',
	description: 'A set of two-state buttons that can be toggled on or off.',
	example,
	code,
	meta: {
		Root: {},
		Item: {},
	},
} satisfies PreviewSchema<typeof ToggleGroup>;
