<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';

	const { slider, range, thumb, value } = createSlider({
		value: [30],
		max: 100,
	});
</script>

<div class="flex w-full items-center justify-center">
	<span {...$slider} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span {...$range} class="h-[3px] bg-white" />
		</span>

		{#each { length: $value.length } as _}
			<span
				{...$thumb()}
				use:thumb
				class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
			/>
		{/each}
	</span>
</div>
