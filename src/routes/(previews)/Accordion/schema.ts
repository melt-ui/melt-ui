import type { Collapsible } from '$lib';
import type { PreviewSchema } from '../helpers';
import example, { props } from './example.svelte';

export const schema = {
	title: 'Accordion',
	description:
		'A vertically stacked set of interactive headings that each reveal an associated section of content.',
	example,
	props
} satisfies PreviewSchema<typeof Collapsible>;
