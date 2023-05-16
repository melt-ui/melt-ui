<script lang="ts" context="module">
	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';
	import type { BaseProps } from '$lib/internal/types';
	import type { Align, Side } from '.';

	type Boundary = Element | null;

	export type PopperContentEventProps = {
		onPointerEnter?: BaseProps['on:pointerenter'];
		onPointerLeave?: BaseProps['on:pointerleave'];
		onFocus?: BaseProps['on:focus'];
		onBlur?: BaseProps['on:blur'];
	}

	export type PopperContentProps = BaseProps & PopperContentEventProps & {
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
		arrowWidth?: number;
		arrowHeight?: number;
	};

	const { getContext, setContext } = reactiveContext<PopperContentContext>();
	export const getPopperContentContext = getContext;
</script>

<script lang="ts">
	type $$Props = PopperContentProps;
	import {
		flip,
		hide,
		limitShift,
		offset,
		shift,
		size,
		type ComputePositionConfig,
		type MiddlewareData,
		type Placement,
		type Strategy,
	} from '@floating-ui/core';
	import { autoUpdate, arrow as floatingUIarrow, platform } from '@floating-ui/dom';

	import { computePosition } from '@floating-ui/core';

	import { onDestroy } from 'svelte';
	import { getRootContext } from './root.svelte';
	import { getSideAndAlignFromPlacement, isDefined, isNotNull, transformOrigin } from './utils';
	import { useActions } from '$lib/internal/helpers';

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

	export let onPointerEnter: $$Props['onPointerEnter'] = null;
	export let onPointerLeave: $$Props['onPointerLeave'] = null;
	export let onBlur: $$Props['onBlur'] = null;
	export let onFocus: $$Props['onFocus'] = null;

	const rootCtx = getRootContext();
	const ctx = setContext({
		placedSide: [side],
		arrowX: [undefined],
		arrowY: [undefined],
		shouldHideArrow: [false],
		arrowWidth: [undefined],
		arrowHeight: [undefined],
	});

	let content: HTMLElement;

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
		altBoundary: hasExplicitBoundaries,
	};

	let strategy: Strategy | null;
	let placement: Placement | null;
	let middlewareData: MiddlewareData | null;
	let x: number | null = null;
	let y: number | null = null;

	function updatePosition(options: ComputePositionConfig) {
		computePosition($rootCtx.anchor, content, options).then(async (position) => {
			({ strategy, placement, middlewareData, x, y } = position);
		});
	}

	let cleanup: (() => void) | null = null;

	onDestroy(() => {
		cleanup?.();
	});

	$: if (content && $rootCtx.anchor) {
		if (cleanup) cleanup();

		cleanup = autoUpdate($rootCtx.anchor, content, () => {
			const arrowWidth = $ctx.arrowWidth ?? 0;
			const arrowHeight = $ctx.arrowHeight ?? 0;

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
								...detectOverflowOptions,
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
						},
					}),
					$rootCtx.arrow
						? floatingUIarrow({ element: $rootCtx.arrow, padding: arrowPadding })
						: undefined,
					transformOrigin({ arrowWidth, arrowHeight }),
					hideWhenDetached ? hide({ strategy: 'referenceHidden' }) : undefined,
				].filter(isDefined),
			});
		});
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

		ctx.update((old) => ({
			...old,
			placedSide,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
		}));
	}

	$: contentZIndex = (content && window?.getComputedStyle(content).zIndex) || 0;
</script>

<div
	bind:this={content}
	on:pointerenter={e => onPointerEnter?.(e)}
	on:pointerleave={e => onPointerLeave?.(e)}
	on:blur={e => onBlur?.(e)}
	on:focus={e => onFocus?.(e)}
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
	use:useActions={$$restProps.use}
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
