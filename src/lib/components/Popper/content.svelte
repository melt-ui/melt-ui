<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import type { BaseProps } from '$lib/types';
	import type { Align, Side } from '.';

	type Boundary = Element | null;

	export type PopperContentProps = BaseProps & {
		side?: Side;
		sideOffset?: number;
		align?: Align;
		alignOffset?: number;
		arrowPadding?: number;
		collisionBoundary?: Boundary | Boundary[];
		collisionPadding?: number | Partial<Record<Side, number>>;
		sticky?: 'partial' | 'always';
		hideWhenDetached?: boolean;
		avoidCollisions?: boolean;
	};

	type PopperContentContext = {
		readonly placedSide: Side;
		readonly arrowX?: number;
		readonly arrowY?: number;
		readonly shouldHideArrow?: boolean;
	};

	const { getContext, setContext } = reactiveContext<PopperContentContext>();
	export const getPopperContentContext = getContext;
</script>

<script lang="ts">
	type $$Props = PopperContentProps;
	import {
		flip,
		arrow as floatingUIarrow,
		hide,
		limitShift,
		offset,
		shift,
		size,
		type ComputePositionConfig,
		type MiddlewareData,
		type Placement,
		type Strategy
	} from '@floating-ui/core';
	import { autoUpdate, platform } from '@floating-ui/dom';

	import { computePosition } from '@floating-ui/core';

	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { getRootContext } from './root.svelte';
	import { getSideAndAlignFromPlacement, isDefined, isNotNull, transformOrigin } from './utils';

	export let side: NonNullable<$$Props['side']> = 'bottom';
	export let sideOffset: NonNullable<$$Props['sideOffset']> = 0;
	export let align: NonNullable<$$Props['align']> = 'center';
	export let alignOffset: NonNullable<$$Props['alignOffset']> = 0;
	export let arrowPadding: NonNullable<$$Props['arrowPadding']> = 0;
	export let collisionBoundary: $$Props['collisionBoundary'] = [];
	export let collisionPadding: NonNullable<$$Props['collisionPadding']> = 0;
	export let sticky: NonNullable<$$Props['sticky']> = 'partial';
	export let hideWhenDetached: NonNullable<$$Props['hideWhenDetached']> = false;
	export let avoidCollisions: NonNullable<$$Props['avoidCollisions']> = true;

	const rootContext = getRootContext();
	setContext({
		placedSide: [side],
		arrowX: [undefined],
		arrowY: [undefined],
		shouldHideArrow: [false]
	});
	const contentContext = getPopperContentContext();

	let content: HTMLElement;

	$: arrow = $rootContext.arrow;
	$: arrowSize = arrow?.getBoundingClientRect();
	$: arrowWidth = arrowSize?.width ?? 0;
	$: arrowHeight = arrowSize?.height ?? 0;

	$: desiredPlacement = (side + (align !== 'center' ? '-' + align : '')) as Placement;

	$: collisionPadding =
		typeof collisionPadding === 'number'
			? collisionPadding
			: { top: 0, right: 0, bottom: 0, left: 0, ...collisionPadding };

	$: boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	$: hasExplicitBoundaries = boundary.length > 0;

	$: detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		// with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
		altBoundary: hasExplicitBoundaries
	};

	let strategy: Strategy | null;
	let placement: Placement | null;
	let middlewareData: MiddlewareData | null;
	let x: number | null,
		y: number | null = null;

	function updatePosition(options: ComputePositionConfig) {
		computePosition($rootContext.anchor, content, options).then(
			async (position) => {
				({ strategy, placement, middlewareData, x, y } = position);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	let cleanup: (() => void) | null = null;

	onDestroy(() => {
		cleanup?.();
	});

	$: if (content && $rootContext.anchor) {
		if (cleanup) cleanup();
		cleanup = autoUpdate($rootContext.anchor, content, () =>
			updatePosition({
				platform,
				strategy: 'fixed',

				placement: desiredPlacement,
				middleware: [
					offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
					avoidCollisions
						? shift({
								mainAxis: true,
								crossAxis: false,
								limiter: sticky === 'partial' ? limitShift() : undefined,
								...detectOverflowOptions
						  })
						: undefined,
					avoidCollisions ? flip({ ...detectOverflowOptions }) : undefined,
					size({
						...detectOverflowOptions,
						apply: ({ elements, rects, availableWidth, availableHeight }) => {
							const { width: anchorWidth, height: anchorHeight } = rects.reference;
							const contentStyle = elements.floating.style;
							contentStyle.setProperty('--radix-popper-available-width', `${availableWidth}px`);
							contentStyle.setProperty('--radix-popper-available-height', `${availableHeight}px`);
							contentStyle.setProperty('--radix-popper-anchor-width', `${anchorWidth}px`);
							contentStyle.setProperty('--radix-popper-anchor-height', `${anchorHeight}px`);
						}
					}),
					arrow ? floatingUIarrow({ element: arrow, padding: arrowPadding }) : undefined,
					transformOrigin({ arrowWidth, arrowHeight }),
					hideWhenDetached ? hide({ strategy: 'referenceHidden' }) : undefined
				].filter(isDefined)
			})
		);
	}

	$: isPlaced = x !== null && y !== null;
	$: [placedSide, placedAlign] = placement
		? getSideAndAlignFromPlacement(placement)
		: [side, undefined];

	$: {
		// Update the content context with the computed position
		const arrowX = middlewareData?.arrow?.x || 0;
		const arrowY = middlewareData?.arrow?.y || 0;
		const cannotCenterArrow = middlewareData?.arrow?.centerOffset !== 0;

		contentContext.set({
			placedSide,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow
		});
	}

	$: contentZIndex = (content && browser && window.getComputedStyle(content).zIndex) || 0;
</script>

<div
	bind:this={content}
	data-radix-popper-content-wrapper=""
	style:position={strategy}
	style:left={0}
	style:top={0}
	style:transform={isPlaced
		? `translate3d(${Math.round(x ?? 0)}px, ${Math.round(y ?? 0)}px, 0)`
		: 'translate3d(0, -200%, 0)'}
	style:min-width="max-content"
	style:z-index={contentZIndex}
	style:--radix-popper-transform-origin={middlewareData?.transformOrigin?.x +
		' ' +
		middlewareData?.transformOrigin?.y}
	dir={$$restProps.dir}
>
	<div
		data-side={placedSide}
		data-align={placedAlign}
		{...$$restProps}
		style:animation="{isPlaced ? undefined : 'none'},"
		style:opacity={middlewareData?.hide?.referenceHidden ? 0 : undefined}
	>
		<slot />
	</div>
</div>
