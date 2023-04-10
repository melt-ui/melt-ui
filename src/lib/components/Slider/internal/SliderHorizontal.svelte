<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getOrientationContext } from '../root.svelte';
	import SliderImpl from './SliderImpl.svelte';
	import { BACK_KEYS, linearScale } from './utils';

	const dispatch = createEventDispatcher<{
		slideStart: { value: number };
		slideMove: { value: number };
		slideEnd: Record<string, never>;
		stepKeyDown: { event: KeyboardEvent; direction: number };
		homeKeyDown: { event: KeyboardEvent };
		endKeyDown: { event: KeyboardEvent };
	}>();
	let slider: HTMLElement;

	export let min: number;
	export let max: number;
	export let dir: 'ltr' | 'rtl';
	export let inverted: boolean;

	const orientation = getOrientationContext();

	$: isDirectionLTR = dir === 'ltr';
	$: isSlidingFromLeft = (isDirectionLTR && !inverted) || (!isDirectionLTR && inverted);

	let rect: DOMRect | undefined;

	function getValueFromPointer(pointerPosition: number) {
		if (!rect) rect = slider.getBoundingClientRect();
		if (!rect) return 0;
		const input: [number, number] = [0, rect.width];
		const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min];
		const value = linearScale(input, output);

		return value(pointerPosition - rect.left);
	}

	$: $orientation = {
		startEdge: isSlidingFromLeft ? 'left' : 'right',
		endEdge: isSlidingFromLeft ? 'right' : 'left',
		size: 'width',
		direction: isSlidingFromLeft ? 1 : -1,
	};
</script>

<SliderImpl
	bind:element={slider}
	data-orientation="horizontal"
	style="{$$restProps.style}; --radix-slider-thumb-transform: translateX(-50%)"
	on:slideStart={(event) => {
		const value = getValueFromPointer(event.detail.clientX);
		dispatch('slideStart', { value });
	}}
	on:slideMove={(event) => {
		const value = getValueFromPointer(event.detail.clientX);
		dispatch('slideMove', { value });
	}}
	on:slideEnd={() => {
		rect = undefined;
		dispatch('slideEnd');
	}}
	on:stepKeyDown={(event) => {
		const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right';
		const isBackKey = BACK_KEYS[slideDirection].includes(event.detail.key);
		dispatch('stepKeyDown', { event: event.detail, direction: isBackKey ? -1 : 1 });
	}}
	on:homeKeyDown
	on:endKeyDown
	{...$$restProps}
>
	<slot />
</SliderImpl>
