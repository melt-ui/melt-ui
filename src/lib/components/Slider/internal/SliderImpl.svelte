<script lang="ts">
	import { getThumbCollectionContext } from '../root.svelte';
	import { createEventDispatcher } from 'svelte';
	import { ARROW_KEYS, PAGE_KEYS } from './utils';

	export let element: HTMLSpanElement;

	const dispatch = createEventDispatcher<{
		homeKeyDown: KeyboardEvent;
		endKeyDown: KeyboardEvent;
		stepKeyDown: KeyboardEvent;
		slideStart: PointerEvent;
		slideMove: PointerEvent;
		slideEnd: PointerEvent;
	}>();

	const thumbCollection = getThumbCollectionContext();
</script>

<span
	{...$$restProps}
	bind:this={element}
	on:keydown={(event) => {
		if (event.key === 'Home') {
			dispatch('homeKeyDown', event);
			// Prevent scrolling to page start
			event.preventDefault();
		} else if (event.key === 'End') {
			dispatch('endKeyDown', event);
			// Prevent scrolling to page end
			event.preventDefault();
		} else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
			dispatch('stepKeyDown', event);
			// Prevent scrolling for directional key presses
			event.preventDefault();
		}
	}}
	on:pointerdown={(event) => {
		const target = event.currentTarget;
		target.setPointerCapture(event.pointerId);
		// Prevent browser focus behaviour because we focus a thumb manually when values change.
		event.preventDefault();
		// Touch devices have a delay before focusing so won't focus if touch immediately moves
		// away from target (sliding). We want thumb to focus regardless.
		if ($thumbCollection.includes(target)) {
			target.focus();
		} else {
			dispatch('slideStart', event);
		}
	}}
	on:pointermove={(event) => {
		const target = event.currentTarget;
		if (target.hasPointerCapture(event.pointerId)) dispatch('slideMove', event);
	}}
	on:pointerup={(event) => {
		const target = event.currentTarget;
		if (target.hasPointerCapture(event.pointerId)) {
			target.releasePointerCapture(event.pointerId);
			dispatch('slideEnd', event);
		}
	}}
>
	<slot />
</span>
