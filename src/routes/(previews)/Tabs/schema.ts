import type { Tabs } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Tabs',
	description: '',
	example,
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
