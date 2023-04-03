import type { Checkbox } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { props } from './example.svelte';

export const schema = {
	title: 'Checkbox',
	description: 'A control that allows the user to toggle between checked and not checked.',
	example,
	props
} satisfies PreviewSchema<typeof Checkbox>;
