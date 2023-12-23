<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	export let values = [20, 80];

	const {
		elements: { root, range, thumbs, ticks },
	} = createSlider({
		defaultValue: values,
		max: 100,
	});
</script>

<main>
	<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span data-testid="range" use:melt={$range} class="h-[3px] bg-white" />
		</span>

		{#each $ticks as tick}
			<span use:melt={tick} data-testid="tick" />
		{/each}

		{#each $thumbs as thumb, i}
			<span
				aria-label="Volume"
				data-testid="thumb-{i}"
				use:melt={thumb}
				class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
			/>
		{/each}
	</span>
</main>
