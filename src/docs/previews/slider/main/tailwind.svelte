<script lang="ts">
	import { createSlider } from '$lib';

	const { slider, range, thumb } = createSlider({
		value: [30],
		max: 100,
	});
</script>

<span melt={$slider} class="relative flex h-[20px] w-[200px] items-center">
	<span class="block h-[3px] w-full bg-black/40">
		<span melt={$range} class="h-[3px] bg-white" />
	</span>
	<span
		melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
