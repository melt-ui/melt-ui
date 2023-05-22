<script lang="ts" context="module">
	import { clamp } from '$lib/internal/helpers/numbers';
	import { uniqueContext } from '$lib/internal/helpers/uniqueContext';
	import type { BaseProps, UnwrapCustomEvents, WrapWithCustomEvent } from '$lib/internal/types';
	import { createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	type Orientation = 'horizontal' | 'vertical';

	export type SliderRootProps = BaseProps<'span'> & {
		name?: string;
		disabled?: boolean;
		orientation?: Orientation;
		dir?: Direction;
		min?: number;
		max?: number;
		step?: number;
		minStepsBetweenThumbs?: number;
		value?: number[] | number;
		inverted?: boolean;
	};

	type RootContext = {
		values: number[];
		readonly min: number;
		readonly max: number;
		readonly disabled: boolean;
		readonly orientation: Orientation;
		valueIndexToChange: number;
	};

	const { getContext, setContext, defaults } = reactiveContext<RootContext>({
		min: 0,
		max: 100,
		disabled: false,
		orientation: 'horizontal',
		valueIndexToChange: -1,
	});
	export const getRootContext = getContext;

	type OrientationContext = Writable<{
		startEdge: 'top' | 'right' | 'bottom' | 'left';
		endEdge: 'top' | 'right' | 'bottom' | 'left';
		size: 'width' | 'height';
		direction: number;
	}>;

	const orientationContext = uniqueContext<OrientationContext>();
	export const getOrientationContext = orientationContext.getContext;

	// Create a context for all thumb components
	const thumbCollectionContext = collectionContext();
	export const getThumbCollectionContext = thumbCollectionContext.getContext;
</script>

<script lang="ts">
	import { collectionContext } from '$lib/internal/helpers/collectionContext';
	import { reactiveContext } from '$lib/internal/helpers';
	import SliderHorizontal from './internal/SliderHorizontal.svelte';
	import SliderVertical from './internal/SliderVertical.svelte';
	import {
		ARROW_KEYS,
		PAGE_KEYS,
		getClosestValueIndex,
		getDecimalCount,
		getNextSortedValues,
		hasMinStepsBetweenValues,
		roundValue,
		type Direction,
	} from './internal/utils';

	type $$Props = SliderRootProps;

	export let step = 1;
	export let minStepsBetweenThumbs = 0;
	export let inverted = false;
	// TODO - Get global dir from Direction Provider
	export let dir: $$Props['dir'] = 'ltr';
	export let min: $$Props['min'] = defaults?.min;
	export let max: $$Props['max'] = defaults?.max;
	export let disabled: $$Props['disabled'] = defaults?.disabled;
	export let orientation: $$Props['orientation'] = defaults?.orientation;
	export let value: $$Props['value'] = [min ?? 0];
	export let name: $$Props['name'] = undefined;

	type $$Events = WrapWithCustomEvent<{
		valueCommit: number[];
		valueChange: number[];
	}>;
	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	// Create root context with initial values
	const ctx = setContext({
		values: (v) => {
			if (Array.isArray(value)) {
				value = Array.isArray(v) ? v : [v];
			} else {
				value = Array.isArray(v) ? v[0] : v;
			}
			onChange(v);
		},
	});

	// Update context when props change
	$: ctx.update((prev) => ({
		...prev,
		values: Array.isArray(value) ? value : [value ?? 0],
		min,
		max,
		disabled,
		orientation,
	}));

	orientationContext.setContext(
		writable({
			startEdge: 'left',
			endEdge: 'right',
			size: 'width',
			direction: 1,
		})
	);

	const thumbComponents = thumbCollectionContext.setContext();

	// Pick the correct orientation component
	$: SliderOrientation = orientation === 'horizontal' ? SliderHorizontal : SliderVertical;

	let valuesBeforeSlideStart = $ctx.values;

	// Update the value when the user interacts with the slider
	function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
		const decimalCount = getDecimalCount(step);
		const snapToStep = roundValue(
			Math.round((value - $ctx.min) / step) * step + $ctx.min,
			decimalCount
		);
		const nextValue = clamp(snapToStep, [$ctx.min, $ctx.max]);

		const prevValues = $ctx.values;
		const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
		if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
			$ctx.valueIndexToChange = nextValues.indexOf(nextValue);

			const hasChanged = String(nextValues) !== String(prevValues);
			if (hasChanged && commit) onValueCommit(nextValues);
			if (hasChanged) {
				$ctx.values = nextValues;
			}
		}
	}

	function onValueCommit(values: number[]) {
		dispatch('valueCommit', values);
	}

	function onChange(nextValues: number[]) {
		dispatch('valueChange', nextValues);
	}
</script>

<svelte:component
	this={SliderOrientation}
	{...$$restProps}
	dir={dir ?? 'ltr'}
	min={$ctx.min}
	max={$ctx.max}
	{inverted}
	aria-disabled={disabled}
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
	on:pointerDown={() => {
		if (!disabled) valuesBeforeSlideStart = $ctx.values;
	}}
	on:slideStart={({ detail }) => {
		if (disabled) return;
		const { value } = detail;
		const closestIndex = getClosestValueIndex($ctx.values, value);
		updateValues(value, closestIndex);
		$thumbComponents.at($ctx.valueIndexToChange)?.focus();
	}}
	on:slideMove={({ detail }) => {
		if (disabled) return;
		const { value } = detail;
		updateValues(value, $ctx.valueIndexToChange);
	}}
	on:slideEnd={() => {
		if (disabled) return;
		const prevValue = valuesBeforeSlideStart[$ctx.valueIndexToChange];
		const nextValue = $ctx.values[$ctx.valueIndexToChange];
		const hasChanged = nextValue !== prevValue;
		if (hasChanged) onValueCommit($ctx.values);
	}}
	on:homeKeyDown={() => !disabled && updateValues($ctx.min, 0, { commit: true })}
	on:endKeyDown={() =>
		!disabled && updateValues($ctx.max, $ctx.values.length - 1, { commit: true })}
	on:stepKeyDown={({ detail }) => {
		if (!disabled) {
			const { event, direction: stepDirection } = detail;
			const isPageKey = PAGE_KEYS.includes(event.key);
			const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
			const multiplier = isSkipKey ? 10 : 1;
			const atIndex = $ctx.valueIndexToChange;
			const value = $ctx.values[atIndex];
			const stepInDirection = step * multiplier * stepDirection;
			updateValues(value + stepInDirection, atIndex, { commit: true });
		}
	}}><slot /></svelte:component
>
{#each $ctx.values as value}
	<input
		type="hidden"
		name={name ? name + ($ctx.values.length > 1 ? '[]' : '') : undefined}
		{value}
		style:display="none"
	/>
{/each}
