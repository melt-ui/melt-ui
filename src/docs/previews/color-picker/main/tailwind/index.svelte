<script lang="ts">
	import { createColorPicker, type ReturnedColor } from '$lib';

	import { Pipette } from 'lucide-svelte';

	const {
		elements: {
			colorCanvas,
			colorPicker,
			hueSlider,
			huePicker,
			alphaSlider,
			alphaPicker,
			eyeDropper,
			hexInput,
		},
		states: { color },
		helpers: { getCurrentColor },
	} = createColorPicker({
		defaultColor: '#5b52aa',
	});

	let savedColors: ReturnedColor[] = [];

	$: savedColorsLimited = savedColors.slice(0, 5);
</script>

<div
	class="flex flex-col items-center justify-center gap-2 rounded-md bg-white p-2"
>
	<div class="canvas relative">
		<canvas
			{...$colorCanvas}
			use:colorCanvas
			class="color-canvas h-[175px] w-[175px] cursor-pointer rounded-sm"
		/>
		<button
			{...$colorPicker}
			use:colorPicker
			class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2"
		/>
	</div>

	<div class="hue relative h-[10px] w-[175px]">
		<button {...$huePicker} use:huePicker class="hue-picker" />
		<canvas
			{...$hueSlider}
			use:hueSlider
			class="h-[10px] w-[175px] cursor-pointer rounded-md"
		/>
	</div>

	<div class="alpha relative h-[10px] w-[175px] rounded-full">
		<button {...$alphaPicker} use:alphaPicker class="alpha-picker" />
		<canvas
			{...$alphaSlider}
			use:alphaSlider
			class="h-[10px] w-[175px] cursor-pointer rounded-full"
		/>
	</div>

	<div class="flex gap-1">
		<button
			{...$eyeDropper}
			use:eyeDropper
			class="inline-flex items-center justify-center rounded-md bg-gray-900 p-1"
		>
			<Pipette class="square-5" />
			<span class="sr-only">Pick</span>
		</button>

		<input
			{...$hexInput}
			use:hexInput
			type="text"
			value={$color}
			class="w-24 rounded-md border border-gray-800 px-2 py-1 text-black"
		/>

		<button
			class="rounded-md bg-magnum-600 p-1"
			on:click={() => (savedColors = [$getCurrentColor(), ...savedColors])}
		>
			Save
		</button>
	</div>

	<div class="flex flex-wrap items-center justify-center gap-2">
		{#each savedColorsLimited as { rgb, hex }}
			<button
				class="h-6 w-6 rounded-md border border-gray-400"
				style="background-color: rgba({rgb.r}, {rgb.g}, {rgb.b})"
				on:click={() => ($color = hex)}
			/>
		{/each}
	</div>
</div>

<style lang="postcss">
	.alpha-picker,
	.hue-picker {
		@apply absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2;
	}
</style>
