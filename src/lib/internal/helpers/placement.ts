import type { Boundary } from '@floating-ui/dom';
import { readable } from 'svelte/store';

export type PositioningOptions = {
	/**
	 * The strategy to use for positioning.
	 * @defaultValue `"absolute"`
	 */
	strategy?: 'absolute' | 'fixed';

	/**
	 * The initial placement of the floating element.
	 * @defaultValue `"top"`
	 */
	placement?:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end';

	/**
	 * The offset of the floating element.
	 */
	offset?: { mainAxis?: number; crossAxis?: number };

	/**
	 * The main axis offset or gap between the reference and floating elements.
	 * @defaultValue `5`
	 */
	gutter?: number;

	/**
	 * The virtual padding around the viewport edges to check for overflow.
	 * @defaultValue `8`
	 */
	overflowPadding?: number;

	/**
	 * Whether to flip the placement.
	 * @defaultValue `true`
	 */
	flip?: boolean;

	/**
	 * Whether the floating element can overlap the reference element.
	 * @defaultValue `false`
	 */
	overlap?: boolean;

	/**
	 * Whether to make the floating element same width as the reference element.
	 * @defaultValue `false`
	 */
	sameWidth?: boolean;

	/**
	 * Whether the floating element should fit the viewport.
	 * @defaultValue `false`
	 */
	fitViewport?: boolean;

	/**
	 * The overflow boundary of the reference element.
	 */
	boundary?: Boundary;
};

const defaultOptions: PositioningOptions = {
	strategy: 'absolute',
	placement: 'top',
	gutter: 5,
	flip: true,
	sameWidth: false,
	overflowPadding: 8,
};

const ARROW_TRANSFORM = {
	bottom: 'rotate(45deg)',
	left: 'rotate(135deg)',
	top: 'rotate(225deg)',
	right: 'rotate(315deg)',
};

export const arrowAttrs = (arrowSize = 8) =>
	readable({
		'data-arrow': 'true',
		style: `position: absolute; width: var(--arrow-size, ${arrowSize}px); height: var(--arrow-size, ${arrowSize}px);`,
	});

export function getPlacement(
	reference: HTMLElement | null,
	floating: HTMLElement | null,
	opts: PositioningOptions
) {
	if (!floating || !reference) return;

	const options = Object.assign({}, defaultOptions, opts);

	const arrowEl = floating.querySelector<HTMLElement>('[data-arrow=true]');
}
