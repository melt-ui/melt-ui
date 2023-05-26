<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import { getTooltipProviderContext } from '../provider.svelte';
	import { getTooltipRootContext } from '../root.svelte';
	import type { TooltipContentImplProps } from './content-impl.svelte';

	export type TooltipContentHoverableProps = TooltipContentImplProps;

	type Point = { x: number; y: number };
	type Polygon = Point[];

	function getExitSideFromRect(point: Point, rect: DOMRect) {
		const top = Math.abs(rect.top - point.y);
		const bottom = Math.abs(rect.bottom - point.y);
		const right = Math.abs(rect.right - point.x);
		const left = Math.abs(rect.left - point.x);

		switch (Math.min(top, bottom, right, left)) {
			case left:
				return 'left';
			case right:
				return 'right';
			case top:
				return 'top';
			case bottom:
				return 'bottom';
			default:
				return null;
		}
	}

	function getPointsFromRect(rect: DOMRect) {
		const { top, right, bottom, left } = rect;
		return [
			{ x: left, y: top },
			{ x: right, y: top },
			{ x: right, y: bottom },
			{ x: left, y: bottom },
		];
	}

	// Determine if a point is inside of a polygon.
	// Based on https://github.com/substack/point-in-polygon
	function isPointInPolygon(point: Point, polygon: Polygon) {
		const { x, y } = point;
		let inside = false;
		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const xi = polygon[i].x;
			const yi = polygon[i].y;
			const xj = polygon[j].x;
			const yj = polygon[j].y;

			// prettier-ignore
			const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	}

	// Returns a new array of points representing the convex hull of the given set of points.
	// https://www.nayuki.io/page/convex-hull-algorithm
	function getHull<P extends Point>(points: Readonly<Array<P>>): Array<P> {
		const newPoints: Array<P> = points.slice();
		newPoints.sort((a: Point, b: Point) => {
			if (a.x < b.x) return -1;
			else if (a.x > b.x) return +1;
			else if (a.y < b.y) return -1;
			else if (a.y > b.y) return +1;
			else return 0;
		});
		return getHullPresorted(newPoints);
	}

	// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
	function getHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P> {
		if (points.length <= 1) return points.slice();

		const upperHull: Array<P> = [];
		for (let i = 0; i < points.length; i++) {
			const p = points[i];
			while (upperHull.length >= 2) {
				const q = upperHull[upperHull.length - 1];
				const r = upperHull[upperHull.length - 2];
				if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
				else break;
			}
			upperHull.push(p);
		}
		upperHull.pop();

		const lowerHull: Array<P> = [];
		for (let i = points.length - 1; i >= 0; i--) {
			const p = points[i];
			while (lowerHull.length >= 2) {
				const q = lowerHull[lowerHull.length - 1];
				const r = lowerHull[lowerHull.length - 2];
				if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
				else break;
			}
			lowerHull.push(p);
		}
		lowerHull.pop();

		if (
			upperHull.length === 1 &&
			lowerHull.length === 1 &&
			upperHull[0].x === lowerHull[0].x &&
			upperHull[0].y === lowerHull[0].y
		) {
			return upperHull;
		} else {
			return upperHull.concat(lowerHull);
		}
	}
</script>

<script lang="ts">
	import { createCallAndCleanup } from '$lib/internal/stores/callAndCleanup';
	import ContentImpl from './content-impl.svelte';

	type $$Props = TooltipContentHoverableProps;

	const providerCtx = getTooltipProviderContext();
	const rootCtx = getTooltipRootContext();
	let ref: HTMLElement | null = null;

	let pointerGraceArea: Polygon | null = null;

	const handleRemoveGraceArea = () => {
		pointerGraceArea = null;
		providerCtx?.update((prev) => {
			return {
				...prev,
				isPointerInTransit: false,
			};
		});
	};

	const handleCreateGraceArea = (event: PointerEvent, hoverTarget: HTMLElement) => {
		const currentTarget = event.currentTarget as HTMLElement;
		const exitPoint = { x: event.clientX, y: event.clientY };
		const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());

		const bleed = exitSide === 'right' || exitSide === 'bottom' ? -5 : 5;
		const isXAxis = exitSide === 'right' || exitSide === 'left';
		const startPoint = isXAxis
			? { x: event.clientX + bleed, y: event.clientY }
			: { x: event.clientX, y: event.clientY + bleed };

		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		const graceArea = getHull([startPoint, ...hoverTargetPoints]);
		pointerGraceArea = graceArea;
		providerCtx?.update((prev) => {
			return {
				...prev,
				isPointerInTransit: true,
			};
		});
	};

	const handlerEffect = createCallAndCleanup();
	$: $handlerEffect(() => {
		if (ref && $rootCtx.trigger) {
			const trigger = $rootCtx.trigger;
			const content = ref;

			const handleTriggerLeave = (event: PointerEvent) => handleCreateGraceArea(event, content);
			const handleContentLeave = (event: PointerEvent) => handleCreateGraceArea(event, trigger);

			$rootCtx.trigger.addEventListener('pointerleave', handleTriggerLeave);
			ref.addEventListener('pointerleave', handleContentLeave);

			return () => {
				$rootCtx.trigger?.removeEventListener('pointerleave', handleTriggerLeave);
				ref?.removeEventListener('pointerleave', handleContentLeave);
			};
		}
	});

	const pgaEffect = createCallAndCleanup();
	$: $pgaEffect(() => {
		if (pointerGraceArea) {
			const pga = pointerGraceArea;

			const handleTrackPointerGrace = (event: PointerEvent) => {
				const target = event.target as HTMLElement;
				const pointerPosition = { x: event.clientX, y: event.clientY };
				const hasEnteredTarget = $rootCtx.trigger?.contains(target) || ref?.contains(target);
				const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pga);

				if (hasEnteredTarget) {
					handleRemoveGraceArea();
				} else if (isPointerOutsideGraceArea) {
					handleRemoveGraceArea();
					$rootCtx.onClose();
				}
			};

			document.addEventListener('pointermove', handleTrackPointerGrace);
			return () => {
				document.removeEventListener('pointermove', handleTrackPointerGrace);
			};
		}
	});

	onDestroy(() => {
		handleRemoveGraceArea();
	});
</script>

<ContentImpl bind:ref {...$$restProps}>
	<slot />
</ContentImpl>
