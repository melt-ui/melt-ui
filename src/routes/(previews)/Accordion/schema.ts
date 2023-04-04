import type { Accordion } from '$lib';
import type { PreviewMeta, PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Accordion',
	description:
		'A vertically stacked set of interactive headings that each reveal an associated section of content.',
	example,
	meta: {
		Root: {
			props: {
				value: {
					type: 'enum',
					options: ['item-1', 'item-2', 'item-3'],
					show: 'value'
				},
				type: {
					type: 'enum',
					options: ['multiple', 'single'],
					default: 'single'
				}
			}
		},
		Content: {
			props: {
				transition: {
					type: 'boolean',
					default: false
				}
			}
		},
		Trigger: {},
		Header: {},
		Item: {
			props: {
				value: {
					type: 'string',
					show: null
				}
			}
		}
		// Casting here instead of satisfies because of the discriminated union in AccordionRootProps
	} as PreviewMeta<typeof Accordion>
} satisfies PreviewSchema<typeof Accordion>;
