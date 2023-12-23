<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumbs },
	} = createSlider({
		defaultValue: [20, 80],
		max: 100,
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="h-[3px] w-full bg-black/40">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>

	{#each $thumbs as thumb}
		<span
			use:melt={thumb}
			class="h-5 w-5 rounded-full bg-white focus:ring-4 focus:!ring-black/40"
		/>
	{/each}
</span>
