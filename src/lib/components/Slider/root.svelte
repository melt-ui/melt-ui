<script lang="ts" context="module">
	import { clamp } from '$lib/internal/helpers/numbers';
	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';
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

	const { getContext, setContext } = reactiveContext<RootContext>();
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
	import SliderHorizontal from './internal/SliderHorizontal.svelte';
	import SliderVertical from './internal/SliderVertical.svelte';
	import {
		ARROW_KEYS,
		getClosestValueIndex,
		getDecimalCount,
		getNextSortedValues,
		hasMinStepsBetweenValues,
		PAGE_KEYS,
		roundValue,
		type Direction,
	} from './internal/utils';

	type $$Props = SliderRootProps;

	export let step = 1;
	export let minStepsBetweenThumbs = 0;
	export let inverted = false;
	// TODO - Get global dir from Direction Provider
	export let dir: NonNullable<$$Props['dir']> = 'ltr';
	export let min: NonNullable<$$Props['min']> = 0;
	export let max: NonNullable<$$Props['max']> = 100;
	export let value: NonNullable<$$Props['value']> = [min];
	export let disabled: NonNullable<$$Props['disabled']> = false;
	export let orientation: NonNullable<$$Props['orientation']> = 'horizontal';
	export let name: $$Props['name'] = undefined;

	type $$Events = WrapWithCustomEvent<{
		valueCommit: number[];
		valueChange: number[];
	}>;
	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	// Create root context with initial values
	const ctx = setContext({
		values: [
			Array.isArray(value) ? value : [value],
			(v) => {
				if (Array.isArray(value)) {
					value = Array.isArray(v) ? v : [v];
				} else {
					value = Array.isArray(v) ? v[0] : v;
				}
				onChange(v);
			},
		],
		min: [min],
		max: [max],
		disabled: [disabled],
		orientation: [orientation],
		valueIndexToChange: [-1],
	});

	// Update context when props change
	$: ctx.set({
		...$ctx,
		values: Array.isArray(value) ? value : [value],
		min,
		max,
		disabled,
		orientation,
	});

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
		const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
		const nextValue = clamp(snapToStep, [min, max]);

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
	{dir}
	{min}
	{max}
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
	on:homeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
	on:endKeyDown={() => !disabled && updateValues(max, $ctx.values.length - 1, { commit: true })}
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
