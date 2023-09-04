<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
		states: { value },
	} = createSlider({
		defaultValue: [0],
		max: 13,
		step: 5,
		onValueChange({ curr, next }) {
			const isMultipleOf5 = next[0] % 5 === 0;
			if (!isMultipleOf5) {
				return curr;
			}
			return next;
		},
	});
</script>

{$value}
<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
	<span class="block h-[3px] w-full bg-black/40">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>
	<span
		use:melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
