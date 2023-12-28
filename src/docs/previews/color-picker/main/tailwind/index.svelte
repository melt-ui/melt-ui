<script lang="ts">
	import { createColorPicker, melt } from '$lib';

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
			channelInput,
		},
		states: { value },
		helpers: { derivedColors },
	} = createColorPicker({
		defaultValue: defaultColor,
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

<div class="flex w-[350px] gap-2 overflow-hidden rounded-md bg-white p-2">
	<div class="flex shrink flex-col items-center justify-center gap-2">
		<div class="canvas relative">
			<canvas
				use:melt={$colorCanvas}
				class="color-canvas h-[175px] w-[175px] cursor-pointer rounded-sm"
				aria-label="Color canvas for showing saturation and brightness."
			/>
			<button
				use:melt={$colorPicker}
				class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2"
				aria-label="Button on color canvas, used to select the saturation and brightness."
			/>
		</div>

		<div class="hue relative h-[10px] w-[175px]">
			<button
				use:melt={$huePicker}
				class="hue-picker"
				aria-label="The button to select the hue color."
			/>
			<canvas
				use:melt={$hueSlider}
				class="h-[10px] w-[175px] cursor-pointer rounded-md"
				aria-label="A canvas element showing all available hue colors."
			/>
		</div>

		<div class="alpha relative h-[10px] w-[175px] rounded-full">
			<button
				use:melt={$alphaPicker}
				class="alpha-picker"
				aria-label="The button to select the alpha value for the color."
			/>
			<canvas
				use:melt={$alphaSlider}
				class="h-[10px] w-[175px] cursor-pointer rounded-full"
				aria-label="A canvas element showing the alpha values for the color."
			/>
		</div>

		<div class="flex w-full gap-1 overflow-hidden">
			<button
				use:melt={$eyeDropper}
				class="inline-flex items-center justify-center rounded-md bg-gray-900 p-1"
				aria-label="An eye dropper button, allowing you to select any color on the screen."
			>
				<Pipette class="square-5" />
				<span class="sr-only">Pick</span>
			</button>

			<input
				use:melt={$hexInput}
				type="text"
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

		<div class="jus flex flex-wrap gap-1 overflow-hidden">
			<label class="grid shrink gap-1 text-black">
				H
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('hue')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				S
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('saturation')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				L
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('lightness')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				A
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('alpha')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				R
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('red')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				G
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('green')}
				/>
			</label>
			<label class="grid shrink gap-1 text-black">
				B
				<input
					class="inline-block w-12 border border-black"
					use:melt={$channelInput('blue')}
				/>
			</label>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-2">
			{#each savedColorsLimited as hex}
				<button
					class="h-6 w-6 rounded-md border border-gray-400"
					style:background-color={hex}
					on:click={() => ($value = hex)}
				/>
			{/each}
		</div>
	</div>

	<div class="shrink-0 text-gray-900">
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
					<p style:color={h}>{h}</p>
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
