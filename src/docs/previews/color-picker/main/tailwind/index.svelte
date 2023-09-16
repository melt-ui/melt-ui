<script lang="ts">
	import { createColorPicker } from '$lib';

	const {
		elements: { canvas, picker, hue, huePicker },
	} = createColorPicker({
		defaultColor: '#5b52aa',
	});
</script>

<!-- Canvas size needs to be the same as the container size. -->
<div class="h-[175px] w-[175px]">
	<div class="canvas relative">
		<!-- Make sure to use width and height attributes, instead of classes. -->
		<canvas
			{...$canvas}
			use:canvas
			class="cursor-pointer"
			width="175"
			height="175"
		/>
		<button
			{...$picker}
			use:picker
			class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2"
		/>
	</div>

	<div class="hue relative mt-2 h-[10px] w-[175px]">
		<canvas {...$hue} use:hue class="rounded-full" width="175" height="10" />
		<button
			{...$huePicker}
			use:huePicker
			class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-2"
		/>
	</div>
</div>
