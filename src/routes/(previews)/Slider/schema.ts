import example from './example.svelte';
import type { PreviewSchema } from '../helpers';
import type { Slider } from '$lib';

export const schema = {
	title: 'Slider',
	description: 'An input where the user selects a value from within a given range.',
	example,
	meta: {
		Root: {
			props: {
				value: {
					type: 'number',
					show: 'value'
				},
				min: {
					type: 'number',
					default: 0
				},
				max: {
					type: 'number',
					default: 100
				},
				step: {
					type: 'number',
					default: 1
				},
				orientation: {
					type: 'enum',
					options: ['horizontal', 'vertical'],
					default: 'horizontal'
				},
				dir: {
					type: 'enum',
					options: ['ltr', 'rtl'],
					default: 'ltr'
				},
				disabled: {
					type: 'boolean',
					default: false
				},
				inverted: {
					type: 'boolean',
					default: false
				},
				minStepsBetweenThumbs: {
					type: 'number',
					default: 0
				}
			}
		},
		Track: {},
		Thumb: {},
		Range: {}
	}
} satisfies PreviewSchema<typeof Slider>;
