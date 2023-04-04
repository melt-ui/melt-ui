import example, { props } from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { Switch } from '$lib';

export const schema = {
	title: 'Switch',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	props
} satisfies PreviewSchema<typeof Switch>;
