<script lang="ts">
	import { createSlider, melt } from '$lib';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		defaultValue: [30],
		max: 100,
	});
</script>

<main>
	<span data-testid="slider" use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span data-testid="range" use:melt={$range} class="h-[3px] bg-white" />
		</span>
		<span
			data-testid="thumb"
			use:melt={$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	</span>
</main>
