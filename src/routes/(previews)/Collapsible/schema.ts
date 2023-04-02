import type { Collapsible } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { props } from './example.svelte';

export const schema = {
	title: 'Collapsible',
	description: 'An interactive component which expands/collapses a panel.',
	example,
	props
} satisfies PreviewSchema<typeof Collapsible>;
