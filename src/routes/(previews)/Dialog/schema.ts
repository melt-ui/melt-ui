import type { Dialog } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';

import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Dialog',
	description:
		'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
	example,
	code,
	meta: {
		Root: {
			props: {
				open: {
					type: 'boolean',
					default: false,
				},
				modal: {
					type: 'boolean',
					default: true,
				},
			},
		},
		Trigger: {
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Portal: {
			props: {
				container: {
					type: 'HTMLElement | string',
					show: null,
				},
			},
		},
		Overlay: {
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Content: {
			props: {
				onPointerDownOutside: {
					type: 'function',
					show: null,
				},
				onEscapeKeyDown: {
					type: 'function',
					show: null,
				},
				openAutoFocus: {
					type: 'boolean',
					typeLabel: 'boolean | HTMLElement',
					default: true,
				},
				closeAutoFocus: {
					type: 'boolean',
					default: true,
				},
			},
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Title: {},
		Description: {},
		Close: {},
	},
} satisfies PreviewSchema<typeof Dialog>;
