// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/floating/placement.ts

import {
	flip,
	type Middleware,
	offset,
	arrow,
	shift,
	size,
	computePosition,
	autoUpdate,
} from '@floating-ui/dom';
import type { FloatingConfig } from './floating.types';
import { noop } from '$lib/internal/helpers';

const defaultConfig = {
	strategy: 'absolute',
	placement: 'top',
	gutter: 5,
	flip: true,
	sameWidth: false,
	overflowPadding: 8,
} satisfies FloatingConfig;

const ARROW_TRANSFORM = {
	bottom: 'rotate(45deg)',
	left: 'rotate(135deg)',
	top: 'rotate(225deg)',
	right: 'rotate(315deg)',
};

export function useFloating(
	reference: HTMLElement | undefined,
	floating: HTMLElement | undefined,
	opts: FloatingConfig = {}
) {
	if (!floating || !reference)
		return {
			destroy: noop,
		};

	const options = { ...defaultConfig, ...opts };

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

	return {
		destroy: autoUpdate(reference, floating, compute),
	};
}
