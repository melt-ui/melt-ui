<script lang="ts">
	import { createSlider, melt } from '$lib';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		defaultValue: [30],
		max: 100,
		orientation: 'vertical',
	});
</script>

<span
	use:melt={$root}
	class="relative flex h-[200px] w-[3px] flex-col items-center"
>
	<span class="block h-[200px] w-full bg-black/40">
		<span use:melt={$range} class="w-full bg-white" />
	</span>
	<span
		use:melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
