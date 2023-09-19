<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';
	export let value = [30];
	export let max = 100;
	export let min = 0;
	export let step = 1;
	const {
		elements: { root, range, thumb, tick },
		states: { ticks }
	} = createSlider({
		defaultValue: value,
		max,
		min,
		step,
	});
</script>

<main>
	<span data-testid="slider" use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span data-testid="range" use:melt={$range} class="h-[3px] bg-white" />
		</span>
		<span
			aria-label="Volume"
			data-testid="thumb"
			use:melt={$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	</span>
	{#each { length: $ticks } as _}
		<span use:melt={$tick()} data-testid="tick" />
	{/each}
</main>
