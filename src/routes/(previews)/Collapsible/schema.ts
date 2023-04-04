import type { Collapsible } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { meta } from './example.svelte';

export const schema = {
	title: 'Collapsible',
	description: 'An interactive component which expands/collapses a panel.',
	example,
	meta: meta
} satisfies PreviewSchema<typeof Collapsible>;
