import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { Select } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Select (WIP)',
	description: 'TODO: Add description',
	example,
	code,
	meta: {
		Root: {},
		Trigger: {},
		Value: {},
		Icon: {},
		Portal: {},
		Content: {},
		Viewport: {},
		Item: {},
		ItemText: {},
		ItemIndicator: {},
		ScrollUpButton: {},
		ScrollDownButton: {},
		Group: {},
		Label: {},
		Separator: {},
		Arrow: {},
	},
} satisfies PreviewSchema<typeof Select>;
