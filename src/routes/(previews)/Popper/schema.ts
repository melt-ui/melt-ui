import type { Popper } from '$lib';
import type { PreviewSchema } from '../helpers';
import example from './example.svelte';

export const schema = {
	title: 'Popper',
	description: 'An interactive component which expands/collapses a panel.',
	example,

	meta: {
		Root: {},
		Anchor: {},
		Arrow: {},
		Content: {
			props: {
				//  side?: Side;
				//  sideOffset?: number;
				//  align?: Align;
				//  alignOffset?: number;
				//  arrowPadding?: number;
				//  collisionBoundary?: Boundary | Boundary[];
				//  collisionPadding?: number | Partial<Record<Side, number>>;
				//  sticky?: 'partial' | 'always';
				//  hideWhenDetached?: boolean;
				//  avoidCollisions?: boolean;

				side: {
					type: 'enum',
					options: ['top', 'right', 'bottom', 'left'],
					default: 'bottom'
				},
				sideOffset: {
					type: 'number',
					default: 0
				},
				align: {
					type: 'enum',
					options: ['start', 'center', 'end'],
					default: 'center'
				},
				alignOffset: {
					type: 'number',
					default: 0
				},
				arrowPadding: {
					type: 'number',
					default: 0
				},
				// collisionBoundary: {
				//   type: 'enum',
				// },
				collisionPadding: {
					type: 'number',
					default: 0
				},
				sticky: {
					type: 'enum',
					options: ['partial', 'always'],
					default: 'partial'
				},
				hideWhenDetached: {
					type: 'boolean',
					default: false
				},
				avoidCollisions: {
					type: 'boolean',
					default: true
				}
			}
		}
	}
} satisfies PreviewSchema<typeof Popper>;
