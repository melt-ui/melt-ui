import type { Accordion } from '$lib';
import type { PreviewMeta, PreviewSchema } from '$lib/internal/helpers';
import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Accordion',
	description:
		'A vertically stacked set of interactive headings that each reveal an associated section of content.',
	example,
	code,
	meta: {
		Root: {
			description: 'Contains all the parts of an accordion.',
			props: {
				value: {
					type: 'enum',
					options: ['item-1', 'item-2', 'item-3'],
					show: 'value',
				},
				type: {
					type: 'enum',
					options: ['multiple', 'single'],
					default: 'single',
				},
				disabled: {
					type: 'boolean',
					default: false,
				},
			},
		},
		Item: {
			description: 'Contains all the parts of a collapsible section.',
			props: {
				value: {
					type: 'string',
					show: null,
				},
			},
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Header: {
			description:
				'Wraps an *Accordion.Trigger*. Use the *asChild* prop to update it to the appropriate heading level for your page.',
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Trigger: {
			description:
				'Toggles the collapsed state of its associated item. It should be nested inside of an *Accordion.Header*.',
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Content: {
			props: {
				transition: {
					type: 'boolean',
					default: false,
				},
			},
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},

		// Casting here instead of satisfies because of the discriminated union in AccordionRootProps
	} as PreviewMeta<typeof Accordion>,
} satisfies PreviewSchema<typeof Accordion>;
