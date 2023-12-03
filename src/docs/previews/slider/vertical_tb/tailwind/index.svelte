<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
		states: { value },
	} = createSlider({
		orientation: 'vertical-tb',
		defaultValue: [30],
	});
</script>

<span
	use:melt={$root}
	class="relative flex h-[200px] w-[20px] flex-col items-center"
>
	<span class="block h-full w-[3px] bg-black/40">
		<span use:melt={$range} class="w-[3px] bg-white" />
	</span>

	{#each $value as _}
		<span
			use:melt={$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	{/each}
</span>
