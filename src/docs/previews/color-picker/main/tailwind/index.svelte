<script lang="ts">
	import { createColorPicker } from '$lib';

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
		},
	} = createColorPicker({
		defaultColor: '#5b52aa',
	});
</script>

<div class="flex flex-col gap-2 rounded-md bg-white p-4">
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

	<button
		{...$eyeDropper}
		use:eyeDropper
		class="inline-flex items-center justify-center gap-1 rounded-md bg-magnum-500 p-1"
	>
		<Pipette class="square-5" />
		<span>Pick</span>
	</button>
</div>

<style lang="postcss">
	.alpha-picker,
	.hue-picker {
		@apply absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2;
	}
</style>
