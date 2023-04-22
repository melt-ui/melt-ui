import type { Tabs } from '$lib';
import type { PreviewSchema } from '$lib/internal/helpers';
import example from './example.svelte';
import code from './example.svelte?raw';

export const schema = {
	title: 'Tabs',
	description:
		'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
	example,
	code,
	meta: {
		Root: {
			props: {
				activateOn: {
					type: 'enum',
					options: ['click', 'focus'],
					default: 'focus',
				},
				orientation: {
					type: 'enum',
					options: ['horizontal', 'vertical'],
					default: 'horizontal',
				},
				dir: {
					type: 'enum',
					options: ['ltr', 'rtl'],
					default: 'ltr',
				},
			},
			dataAttributes: {
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
			},
		},
		List: {
			dataAttributes: {
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
			},
		},
		Trigger: {
			dataAttributes: {
				'data-state': {
					values: ['active', 'inactive'],
				},
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
				'data-disabled': {
					values: ['true', 'false'],
				},
			},
		},
		Content: {
			dataAttributes: {
				'data-state': {
					values: ['active', 'inactive'],
				},
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Tabs>;
