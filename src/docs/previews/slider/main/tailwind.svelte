<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		value: [30],
		max: 100,
	});
</script>

<span melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="block h-[3px] w-full bg-black/40">
		<span melt={$range} class="h-[3px] bg-white" />
	</span>
	<span
		melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
