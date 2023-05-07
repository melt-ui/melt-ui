import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { AlertDialog } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Alert Dialog',
	description: 'TODO: Add description',
	example,
	code,
	meta: {
		Root: {},
		Trigger: {},
		Portal: {},
		Overlay: {},
		Content: {},
		Cancel: {},
		Action: {},
		Title: {},
		Description: {},
	},
} satisfies PreviewSchema<typeof AlertDialog>;
