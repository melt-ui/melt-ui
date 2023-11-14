<script lang="ts">
	import { cn } from '$docs/utils';
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		defaultValue: [60],
		max: 100,
	});
	let className = '';
	export { className as class };
</script>

<span use:melt={$root} class={cn('relative flex  w-[15rem] items-center', className)}>
	<span class="block h-1.5 w-full rounded-full bg-neutral-700">
		<span use:melt={$range} class="h-1.5 rounded-full bg-magnum-400" />
	</span>
	<span
		use:melt={$thumb()}
		class="block rounded-full bg-black square-6 focus:ring-4 focus:ring-magnum-600 dark:bg-white"
	/>
</span>
