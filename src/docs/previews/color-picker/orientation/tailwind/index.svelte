<script lang="ts">
	import { createColorPicker } from '$lib';
	import { writable } from 'svelte/store';

	const alphaValue = writable(100);
	const hueAngle = writable(0);

	const {
		elements: {
			colorCanvas,
			colorPicker,
			hueSlider,
			huePicker,
			alphaSlider,
			alphaPicker,
		},
		states: { value },
	} = createColorPicker({
		alphaValue,
		hueAngle,
		hueSliderOrientation: 'vertical',
		alphaSliderOrientation: 'vertical',
	});
</script>

<div class="flex items-center justify-center gap-2 rounded-md bg-white p-2">
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

	<div class="hue relative h-[175px] w-[10px]">
		<button {...$huePicker} use:huePicker class="hue-picker" />
		<canvas
			{...$hueSlider}
			use:hueSlider
			class="h-[175px] w-[10px] cursor-pointer rounded-md"
		/>
	</div>

	<div class="alpha relative h-[175px] w-[10px] rounded-full">
		<button {...$alphaPicker} use:alphaPicker class="alpha-picker" />
		<canvas
			{...$alphaSlider}
			use:alphaSlider
			class="h-[175px] w-[10px] cursor-pointer rounded-full"
		/>
	</div>
</div>

<style lang="postcss">
	.alpha-picker,
	.hue-picker {
		@apply absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2;
	}
</style>
