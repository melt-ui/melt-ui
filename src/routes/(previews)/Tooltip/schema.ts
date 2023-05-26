import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { Tooltip } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Tooltip',
	description:
		'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
	example,
	code,
	meta: {
		Provider: {
			description: 'Wraps your app to provide global functionality to your tooltips.',
			props: {
				delayDuration: {
					type: 'number',
					default: 700,
				},
				skipDelayDuration: {
					type: 'number',
					default: 300,
				},
				disableHoverableContent: {
					type: 'boolean',
					default: false,
				},
			},
		},
		Root: {
			description: 'Contains all the parts of a tooltip.',
			props: {
				open: {
					default: false,
					type: 'boolean',
				},
				delayDuration: {
					type: 'number',
					default: 700,
				},
				disableHoverableContent: {
					type: 'boolean',
					default: false,
				},
			},
		},
		Trigger: {
			description:
				'The button that toggles the tooltip. By default, the *Tooltip.Content* will position itself against the trigger.',
			dataAttributes: {
				'data-state': {
					values: ['closed', 'delayed-open', 'instant-open'],
				},
			},
		},
		Portal: {
			description: 'When used, portals the content part into the body.',
			props: {
				container: {
					type: 'HTMLElement | string',
					show: null,
				},
			},
		},
		Content: {
			description: 'The component that pops out when the tooltip is open.',
			props: {
				side: {
					type: 'enum',
					options: ['top', 'right', 'bottom', 'left'],
					default: 'top',
				},
				sideOffset: {
					type: 'number',
					default: 0,
				},
				align: {
					type: 'enum',
					options: ['start', 'center', 'end'],
					default: 'center',
				},
				alignOffset: {
					type: 'number',
					default: 0,
				},
				arrowPadding: {
					type: 'number',
					default: 0,
				},
				// collisionBoundary: {
				//   type: 'enum',
				// },
				collisionPadding: {
					type: 'number',
					default: 0,
				},
				sticky: {
					type: 'enum',
					options: ['partial', 'always'],
					default: 'partial',
				},
				hideWhenDetached: {
					type: 'boolean',
					default: false,
				},
				avoidCollisions: {
					type: 'boolean',
					default: true,
				},
			},

			dataAttributes: {
				'data-side': {
					values: ['top', 'right', 'bottom', 'left'],
				},
				'data-align': {
					values: ['start', 'center', 'end'],
				},
			},
		},
		Arrow: {
			description:
				'An optional arrow element to render alongside the tooltip. This can be used to help visually link the trigger with the *Tooltip.Content*. Must be rendered inside *Tooltip.Content*.',
			props: {
				width: {
					type: 'number',
					default: 10,
				},
				height: {
					type: 'number',
					default: 5,
				},
			},
		},
	},
} satisfies PreviewSchema<typeof Tooltip>;
