import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { RadioGroup } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Radio Group',
	description:
		'A set of checkable buttons — known as radio buttons — where no more than one of the buttons can be checked at a time.',
	example,
	code,
	meta: {
		Root: {
			props: {
				value: {
					type: 'string',
					default: 'default',
					show: 'value',
				},
				disabled: {
					type: 'boolean',
					default: false,
				},
				name: {
					type: 'string',
					default: '',
				},
				orientation: {
					type: 'enum',
					options: ['horizontal', 'vertical'],
					default: undefined,
				},
				required: {
					type: 'boolean',
					default: false,
				},
				dir: {
					type: 'enum',
					options: ['ltr', 'rtl'],
					default: 'ltr',
				},
				loop: {
					type: 'boolean',
					default: true,
				},
			},
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-orientation': {
					values: ['horizontal', 'vertical'],
				},
			},
		},
		Item: {
			props: {
				value: {
					type: 'string',
					show: null,
				},
				disabled: {
					type: 'boolean',
					show: null,
				},
				required: {
					type: 'boolean',
					show: null,
				},
			},
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['checked', 'unchecked'],
				},
			},
		},
		Indicator: {
			dataAttributes: {
				'data-disabled': {
					values: 'Present when disabled',
				},
				'data-state': {
					values: ['checked', 'unchecked'],
				},
			},
		},
	},
} satisfies PreviewSchema<typeof RadioGroup>;
