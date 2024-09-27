// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/floating.types.ts

import type { FlipOptions } from '@floating-ui/core';
import type { Boundary } from '@floating-ui/dom';

/**
 * The floating element configuration.
 * @see https://floating-ui.com/
 * When `null`, the element won't use floating-ui.
 */
export type FloatingConfig = {
	/**
	 * The initial placement of the floating element.
	 * @defaultValue `"top"`
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
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
	 * The strategy to use for positioning.
	 * @defaultValue `"absolute"`
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	strategy?: 'absolute' | 'fixed' | undefined;

	/**
	 * The offset of the floating element.
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	offset?: { mainAxis?: number; crossAxis?: number } | undefined;

	/**
	 * The main axis offset or gap between the reference and floating elements.
	 * @defaultValue `5`
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	gutter?: number | undefined;

	/**
	 * The virtual padding around the viewport edges to check for overflow.
	 * @defaultValue `8`
	 *
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	overflowPadding?: number | undefined;

	/**
	 * Whether to flip the placement.
	 * @defaultValue `true`
	 *
	 * @see https://floating-ui.com/docs/flip
	 */
	flip?: boolean | FlipOptions | undefined;

	/**
	 * Whether the floating element can overlap the reference element.
	 * @defaultValue `false`
	 *
	 * @see https://floating-ui.com/docs/shift#options
	 */
	overlap?: boolean | undefined;

	/**
	 * Whether to make the floating element same width as the reference element.
	 * @defaultValue `false`
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	sameWidth?: boolean | undefined;

	/**
	 * Whether the floating element should fit the viewport.
	 * @defaultValue `false`
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	fitViewport?: boolean | undefined;

	/**
	 * The overflow boundary of the reference element.
	 *
	 * @see https://floating-ui.com/docs/detectoverflow#boundary
	 */
	boundary?: Boundary | undefined;
} | null;
