<script lang="ts">
	import { createColorPicker } from '$lib';

	const ctx = createColorPicker();

	const {
		elements: { canvas, picker, hue },
	} = ctx;
</script>

<!-- Canvas size needs to be the same as the container size. -->
<div class="h-[175px] w-[175px]">
	<div class="picker relative">
		<!-- Make sure to use width and height attributes, instead of classes. -->
		<canvas
			{...$canvas}
			use:canvas
			class="cursor-pointer rounded-sm"
			width="175"
			height="175"
		/>
		<button
			{...$picker}
			use:picker
			class="absolute h-3 w-3 rounded-full border border-black !outline !outline-1 !outline-white focus:outline-offset-1"
		/>
	</div>

	<!-- <div class="hue relative">
		<canvas {...$hue} use:hue class="rounded-full" width="175" height="10" />
	</div> -->
</div>
