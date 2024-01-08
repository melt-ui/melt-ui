<script lang="ts">
	import { createColorPicker, melt } from '$lib';
	import { writable } from 'svelte/store';

	const alphaValue = writable(100);
	const hueAngle = writable(0);

	const {
		elements: {
			colorCanvas,
			colorCanvasThumb: colorPicker,
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

	<div class="hue relative">
		<button
			use:melt={$huePicker}
			class="hue-picker"
			aria-label="The button to select the hue color."
		/>
		<canvas
			use:melt={$hueSlider}
			class="h-[175px] w-[10px] cursor-pointer rounded-full"
			aria-label="A canvas element showing all available hue colors."
		/>
	</div>

	<div class="alpha relative">
		<button
			use:melt={$alphaPicker}
			class="alpha-picker"
			aria-label="The button to select the alpha value for the color."
		/>
		<canvas
			use:melt={$alphaSlider}
			class="h-[175px] w-[10px] cursor-pointer rounded-full"
			aria-label="A canvas element showing the alpha values for the color."
		/>
	</div>
</div>

<style lang="postcss">
	.alpha-picker,
	.hue-picker {
		@apply absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2;
	}
</style>
