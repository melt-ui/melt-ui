<script lang="ts">
	import { createColorPicker } from '$lib';

	const {
		elements: { colorCanvas, colorPicker, hueSlider, huePicker },
	} = createColorPicker({
		defaultColor: '#5b52aa',
	});
</script>

<div class="rounded-md bg-white p-4">
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

	<div class="hue relative mt-2 h-[10px] w-[175px]">
		<canvas
			{...$hueSlider}
			use:hueSlider
			class="h-[10px] w-[175px] cursor-pointer rounded-md"
		/>
		<button
			{...$huePicker}
			use:huePicker
			class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2"
		/>
	</div>
</div>
