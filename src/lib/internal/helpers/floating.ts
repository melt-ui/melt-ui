// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/placement.ts
// Represents version v0.9.6 (2023-06-10)

import {
	flip,
	type Boundary,
	type Middleware,
	offset,
	arrow,
	shift,
	size,
	computePosition,
	autoUpdate,
} from '@floating-ui/dom';
import { readable } from 'svelte/store';

export type PositionOptions = {
	/**
	 * The strategy to use for positioning.
	 * @defaultValue `"absolute"`
	 */
	strategy?: 'absolute' | 'fixed';

	/**
	 *
	 *
	 */
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

const defaultOptions: PositionOptions = {
	strategy: 'absolute',
	placement: 'bottom',
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
	reference: HTMLElement | undefined,
	floating: HTMLElement | undefined,
	opts: PositionOptions = {}
) {
	if (!floating || !reference) return;

	const options = Object.assign({}, defaultOptions, opts);

	const arrowEl = floating.querySelector<HTMLElement>('[data-arrow=true]');
	const middleware: Middleware[] = [];

	if (options.flip) {
		middleware.push(
			flip({
				boundary: options.boundary,
				padding: options.overflowPadding,
			})
		);
	}

	const arrowOffset = arrowEl ? arrowEl.offsetHeight / 2 : 0;
	if (options.gutter || options.offset) {
		const data = options.gutter ? { mainAxis: options.gutter } : options.offset;
		if (data?.mainAxis != null) {
			data.mainAxis += arrowOffset;
		}
		middleware.push(offset(data));
	}

	middleware.push(
		shift({
			boundary: options.boundary,
			crossAxis: options.overlap,
			padding: options.overflowPadding,
		})
	);

	if (arrowEl) {
		middleware.push(arrow({ element: arrowEl, padding: 8 }));
	}

	middleware.push(
		size({
			padding: options.overflowPadding,
			apply({ rects, availableHeight, availableWidth }) {
				if (options.sameWidth) {
					Object.assign(floating.style, {
						width: `${Math.round(rects.reference.width)}px`,
						minWidth: 'unset',
					});
				}

				if (options.fitViewport) {
					Object.assign(floating.style, {
						maxWidth: `${availableWidth}px`,
						maxHeight: `${availableHeight}px`,
					});
				}
			},
		})
	);

	function compute() {
		if (!reference || !floating) return;
		const { placement, strategy } = options;

		computePosition(reference, floating, {
			placement,
			middleware,
			strategy,
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);

			Object.assign(floating.style, {
				top: `${y}px`,
				left: `${x}px`,
			});

			if (arrowEl && data.middlewareData.arrow) {
				const { x, y } = data.middlewareData.arrow;

				const dir = data.placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';

				Object.assign(arrowEl.style, {
					position: 'absolute',
					left: x != null ? `${x}px` : '',
					top: y != null ? `${y}px` : '',
					[dir]: `calc(100% - ${arrowOffset}px)`,
					transform: ARROW_TRANSFORM[dir],
					backgroundColor: 'inherit',
					zIndex: 'inherit',
				});
			}

			return data;
		});
	}

	// Apply `position` to floating element prior to the computePosition() call.
	Object.assign(floating.style, {
		position: options.strategy,
	});

	return autoUpdate(reference, floating, compute);
}
