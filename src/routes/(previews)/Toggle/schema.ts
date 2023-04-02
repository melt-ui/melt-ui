import example, { props } from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { Toggle } from '$lib';

export const schema = {
	title: 'Toggle',
	description: 'A two-state button that can be either on or off.',
	example,
	props
} satisfies PreviewSchema<typeof Toggle>;
