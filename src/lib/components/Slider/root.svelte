<script lang="ts" context="module">
	import { clamp } from '$lib/helpers/numbers';
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { uniqueContext } from '$lib/helpers/uniqueContext';
	import type { BaseProps } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	type Orientation = 'horizontal' | 'vertical';

	export type SliderRootProps = BaseProps<HTMLSpanElement> & {
		name?: string;
		disabled?: boolean;
		orientation?: Orientation;
		dir?: Direction;
		min?: number;
		max?: number;
		step?: number;
		minStepsBetweenThumbs?: number;
		value?: number[];
		inverted?: boolean;
	};

	type RootContext = {
		values: number[];
		readonly min: number;
		readonly max: number;
		readonly disabled: boolean;
		readonly orientation: Orientation;
		thumbs: Array<HTMLElement>;
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
</script>

<script lang="ts">
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
		type Direction
	} from './internal/utils';

	type $$Props = SliderRootProps;

	export let step = 1;
	export let minStepsBetweenThumbs = 0;
	export let inverted = false;
	// Todo - Get global dir from Direction Provider
	export let dir: NonNullable<$$Props['dir']> = 'ltr';
	export let min: NonNullable<$$Props['min']> = 0;
	export let max: NonNullable<$$Props['max']> = 100;
	export let value: NonNullable<$$Props['value']> = [min];
	export let disabled: NonNullable<$$Props['disabled']> = false;
	export let orientation: NonNullable<$$Props['orientation']> = 'horizontal';
	export let name: $$Props['name'] = undefined;

	const dispatch = createEventDispatcher<{
		valueCommit: number[];
		valueChange: number[];
	}>();

	// Create root context with initial values
	const contextStore = setContext({
		values: [
			value,
			(v) => {
				value = v;
				onChange(v);
			}
		],
		min: [$$restProps.min],
		max: [max],
		disabled: [disabled],
		orientation: [orientation],
		thumbs: [[], () => {}],
		valueIndexToChange: [-1, () => {}]
	});

	// Update context when props change
	$: contextStore.set({
		...$contextStore,
		values: value,
		min,
		max,
		disabled,
		orientation
	});

	orientationContext.setContext(
		writable({
			startEdge: 'left',
			endEdge: 'right',
			size: 'width',
			direction: 1
		})
	);

	// Pick the correct orientation component
	$: SliderOrientation = orientation === 'horizontal' ? SliderHorizontal : SliderVertical;

	let valuesBeforeSlideStart = value;

	// Update the value when the user interacts with the slider
	function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
		const decimalCount = getDecimalCount(step);
		const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
		const nextValue = clamp(snapToStep, [min, max]);

		const prevValues = $contextStore.values;
		const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
		if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
			$contextStore.valueIndexToChange = nextValues.indexOf(nextValue);

			const hasChanged = String(nextValues) !== String(prevValues);
			if (hasChanged && commit) onValueCommit(nextValues);
			if (hasChanged) {
				$contextStore.values = nextValues;
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
		if (!disabled) valuesBeforeSlideStart = $contextStore.values;
	}}
	on:slideStart={({ detail }) => {
		if (disabled) return;
		const { value } = detail;
		const closestIndex = getClosestValueIndex($contextStore.values, value);
		updateValues(value, closestIndex);
		$contextStore.thumbs[$contextStore.valueIndexToChange]?.focus();
	}}
	on:slideMove={({ detail }) => {
		if (disabled) return;
		const { value } = detail;
		updateValues(value, $contextStore.valueIndexToChange);
	}}
	on:slideEnd={() => {
		if (disabled) return;
		const prevValue = valuesBeforeSlideStart[$contextStore.valueIndexToChange];
		const nextValue = $contextStore.values[$contextStore.valueIndexToChange];
		const hasChanged = nextValue !== prevValue;
		if (hasChanged) onValueCommit($contextStore.values);
	}}
	on:homeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
	on:endKeyDown={() =>
		!disabled && updateValues(max, $contextStore.values.length - 1, { commit: true })}
	on:stepKeyDown={({ detail }) => {
		if (!disabled) {
			const { event, direction: stepDirection } = detail;
			const isPageKey = PAGE_KEYS.includes(event.key);
			const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
			const multiplier = isSkipKey ? 10 : 1;
			const atIndex = $contextStore.valueIndexToChange;
			const value = $contextStore.values[atIndex];
			const stepInDirection = step * multiplier * stepDirection;
			updateValues(value + stepInDirection, atIndex, { commit: true });
		}
	}}><slot /></svelte:component
>
{#each $contextStore.values as value}
	<input
		type="hidden"
		name={name ? name + ($contextStore.values.length > 1 ? '[]' : '') : undefined}
		{value}
		style:display="none"
	/>
{/each}
