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
import type { FloatingConfig } from './types.js';
import { isHTMLElement, noop } from '$lib/internal/helpers/index.js';
import type { Placement, VirtualElement } from '@floating-ui/core';

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

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const;
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const;

type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];

export function useFloating(
	reference: HTMLElement | VirtualElement | undefined,
	floating: HTMLElement | undefined,
	opts: FloatingConfig = {}
) {
	if (!floating || !reference || opts === null)
		return {
			destroy: noop,
		};

	const options = { ...defaultConfig, ...opts };

	const arrowEl = floating.querySelector('[data-arrow=true]');
	const middleware: Middleware[] = [];

	if (options.flip) {
		middleware.push(
			flip({
				boundary: options.boundary,
				padding: options.overflowPadding,
			})
		);
	}

	const arrowOffset = isHTMLElement(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
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
		// if the reference is no longer in the document (e.g. it was removed), ignore it
		if (isHTMLElement(reference) && !reference.ownerDocument.documentElement.contains(reference))
			return;
		const { placement, strategy } = options;

		computePosition(reference, floating, {
			placement,
			middleware,
			strategy,
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);

			// get the chosen side and align from the placement to apply as attributes
			// to the floating element and arrow
			const [side, align] = getSideAndAlignFromPlacement(data.placement);

			floating.setAttribute('data-side', side);
			floating.setAttribute('data-align', align);

			Object.assign(floating.style, {
				position: options.strategy,
				top: `${y}px`,
				left: `${x}px`,
			});

			if (isHTMLElement(arrowEl) && data.middlewareData.arrow) {
				const { x, y } = data.middlewareData.arrow;

				const dir = data.placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';

				arrowEl.setAttribute('data-side', dir);

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

function getSideAndAlignFromPlacement(placement: Placement) {
	const [side, align = 'center'] = placement.split('-');
	return [side as Side, align as Align] as const;
}
