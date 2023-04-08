<script lang="ts" context="module">
	import { useCollection } from '$lib/helpers/collectionContext';
	import type { BaseProps } from '$lib/types';
	import { convertValueToPercentage, linearScale } from './internal/utils';
	import { getOrientationContext, getRootContext, getThumbCollectionContext } from './root.svelte';

	export type SliderThumbProps = BaseProps<HTMLSpanElement>;
</script>

<script lang="ts">
	type $$Props = SliderThumbProps;

	const rootCtx = getRootContext();
	const orientation = getOrientationContext();

	let size = { width: 0, height: 0 };
	let index: number;

	const thumbComponentsContext = getThumbCollectionContext();
	$: value = $rootCtx.values[index];

	$: percentage = convertValueToPercentage(value, $rootCtx.min, $rootCtx.max);
	$: label = getLabel(index, $rootCtx.values.length);

	$: orientationSize = size[$orientation.size];
	$: thumbInBoundsOffset = orientationSize
		? getThumbInBoundsOffset(orientationSize, percentage, $orientation.direction)
		: 0;

	/**
	 * Returns a label for each thumb when there are two or more thumbs
	 */
	function getLabel(index: number, totalValues: number) {
		if (totalValues > 2) {
			return `Value ${index + 1} of ${totalValues}`;
		} else if (totalValues === 2) {
			return ['Minimum', 'Maximum'][index];
		} else {
			return undefined;
		}
	}

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges
	 */
	function getThumbInBoundsOffset(width: number, left: number, direction: number) {
		const halfWidth = width / 2;
		const halfPercent = 50;
		const offset = linearScale([0, halfPercent], [0, halfWidth]);
		return (halfWidth - offset(left) * direction) * direction;
	}

	function onIndexChange(newIndex: number) {
		index = newIndex;
	}
</script>

<span
	style:transform="var(--radix-slider-thumb-transform)"
	style:position="absolute"
	style="{$orientation.startEdge}: calc({percentage}% + {thumbInBoundsOffset}px)"
>
	<span
		use:useCollection={{ collection: thumbComponentsContext, onIndexChange }}
		{...$$restProps}
		bind:clientHeight={size.height}
		bind:clientWidth={size.width}
		role="slider"
		aria-label={$$props['aria-label'] || label}
		aria-valuemin={$rootCtx.min}
		aria-valuenow={value}
		aria-valuemax={$rootCtx.max}
		aria-orientation={$rootCtx.orientation}
		data-orientation={$rootCtx.orientation}
		data-disabled={$rootCtx.disabled ? '' : undefined}
		tabindex={$rootCtx.disabled ? undefined : 0}
		style:display={value === undefined ? 'none' : 'inherit'}
		on:focus={() => {
			$rootCtx.valueIndexToChange = index;
		}}><slot /></span
	></span
>
