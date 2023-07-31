<script lang="ts">
	import { createSlider } from '$lib';

	const { slider, range, thumb } = createSlider({
		value: [30],
		max: 100,
		orientation: 'vertical',
	});
</script>

<span
	melt={$slider}
	class="relative flex h-[200px] w-[3px] flex-col items-center"
>
	<span class="block h-[200px] w-full bg-black/40">
		<span melt={$range} class="w-full bg-white" />
	</span>
	<span
		melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
