import type { Checkbox } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { meta } from './example.svelte';

export const schema = {
	title: 'Checkbox',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	meta: meta
} satisfies PreviewSchema<typeof Checkbox>;
