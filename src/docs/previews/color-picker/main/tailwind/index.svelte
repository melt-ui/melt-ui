<script lang="ts">
	import { createColorPicker } from '$lib';

	import { Pipette } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	const defaultColor = '#5b52aa';
	const alphaValue = writable(100);
	const hueAngle = writable(0);

	let history: string[] = [];

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
		states: { value },
		helpers: { derivedColors },
	} = createColorPicker({
		defaultColor,
		alphaValue,
		hueAngle,
		onValueChange: ({ curr, next }) => {
			history = [curr, ...history.slice(0, 20)];
			return next;
		},
	});

	let savedColors: string[] = [];

	$: savedColorsLimited = savedColors.slice(0, 5);
	$: ({ rgb, hsl, hsv } = $derivedColors);
</script>

<div class="flex gap-2 rounded-md bg-white p-2">
	<div class="flex flex-col items-center justify-center gap-2">
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
				value={$value}
				class="w-24 rounded-md border border-gray-800 px-2 py-1 text-black"
				aria-label="hex color value"
			/>

			<button
				class="rounded-md bg-magnum-600 p-1"
				on:click={() => (savedColors = [$value, ...savedColors])}
			>
				Save
			</button>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-2">
			{#each savedColorsLimited as hex}
				<button
					class="h-6 w-6 rounded-md border border-gray-400"
					style="background-color: {hex}"
					on:click={() => ($value = hex)}
				/>
			{/each}
		</div>
	</div>

	<div class="text-gray-900">
		<div class="flex flex-col">
			<h4 class="font-bold tracking-tight">Derived Colors</h4>
			<div class="text-sm">
				<p>RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>
				<p>
					HSV: {hsv.h}, {(hsv.s * 100).toFixed(0)}%, {(hsv.v * 100).toFixed(0)}%
				</p>
				<p>HSL: {hsl.h}, {hsl.s.toFixed(0)}%, {hsl.l.toFixed(0)}%</p>
			</div>
		</div>
		<div class="mt-2">
			<h4 class="font-bold tracking-tight">History</h4>
			<div class="h-36 overflow-hidden text-sm">
				{#each history as h}
					<p style="color: {h}">{h}</p>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.alpha-picker,
	.hue-picker {
		@apply absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2;
	}
</style>
