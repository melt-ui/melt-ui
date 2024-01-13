<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumbs, ticks },
	} = createSlider({
		defaultValue: [5],
		min: 0,
		step: 1,
		max: 10,
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="h-[3px] w-full bg-black/40">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>

	{#each $ticks as tick}
		<span
			use:melt={tick}
			class="h-[3px] w-[3px] rounded-full bg-white/50 data-[bounded]:bg-magnum-800/75"
		/>
	{/each}

	<span
		use:melt={$thumbs[0]}
		class="h-5 w-5 rounded-full bg-white focus:ring-4 focus:!ring-black/40"
	/>
</span>
