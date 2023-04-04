import type { Accordion } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { meta } from './example.svelte';

export const schema = {
	title: 'Accordion',
	description:
		'A vertically stacked set of interactive headings that each reveal an associated section of content.',
	example,
	meta: meta
} satisfies PreviewSchema<typeof Accordion>;
