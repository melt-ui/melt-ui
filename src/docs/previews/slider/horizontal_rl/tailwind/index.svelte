<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
		states: { value },
	} = createSlider({
		orientation: 'horizontal-rl',
		defaultValue: [30],
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="block h-[3px] w-full bg-black/40">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>

	{#each $value as _}
		<span
			use:melt={$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	{/each}
</span>
