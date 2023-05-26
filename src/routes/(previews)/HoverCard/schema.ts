import type { HoverCard } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

import { schema as PopperSchema } from '../Popper/schema';

export const schema = {
	title: 'Hover Card',
	description: 'For sighted users to preview content available behind a link.',
	example,
	code,
	meta: {
		Root: {
			props: {
				open: {
					type: 'boolean',
					default: false,
				},
				openDelay: {
					type: 'number',
					default: 750,
				},
				closeDelay: {
					type: 'number',
					default: 300,
				},
			},
		},
		Trigger: {
			events: {
				change: {
					payload: [true, false],
				},
			},
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Portal: {
			description: 'When used, portals your overlay and content parts into the body.',
			props: {
				container: {
					type: 'HTMLElement | string',
					show: null,
				},
			},
		},
		Content: {
			...PopperSchema.meta.Content,
			dataAttributes: {
				...PopperSchema.meta.Content.dataAttributes,
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Arrow: PopperSchema.meta.Arrow,
	},
} satisfies PreviewSchema<typeof HoverCard>;
