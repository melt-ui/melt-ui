<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	export let enableSwap = false;

	const {
		elements: { root, range, thumbs },
	} = createSlider({
		defaultValue: [20, 30, 40, 80],
		max: 100,
		enableSwap,
	});
</script>

<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="h-[3px] w-full bg-white">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>

	{#each $thumbs as thumb, i}
		<span
			use:melt={thumb}
			class="inline-flex h-5 w-5 cursor-grab items-center justify-center rounded-full bg-white font-semibold text-black focus:ring-4 focus:!ring-black/40"
		>
			{i}
		</span>
	{/each}
</span>
