import type { AspectRatio, Dialog } from '$lib';
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
			},
		},
		Close: {},
		Content: {},
		Portal: {},
		Trigger: {},
		Description: {},
		Title: {},
		Overlay: {},
	},
} satisfies PreviewSchema<typeof Dialog>;
