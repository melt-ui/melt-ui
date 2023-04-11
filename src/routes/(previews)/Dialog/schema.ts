import type { Dialog } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Dialog',
	description:
		'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
	example,
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
				openAutoFocus: {
					type: 'boolean',
					default: true,
				},
				closeAutoFocus: {
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
