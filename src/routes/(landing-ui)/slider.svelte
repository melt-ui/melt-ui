<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumbs },
	} = createSlider({
		defaultValue: [60],
		max: 100,
	});

	let className = '';
	export { className as class };
</script>

<span use:melt={$root} class={cn('relative flex w-[15rem] items-center', className)}>
	<span class="block h-1.5 w-full rounded-full bg-neutral-400 dark:bg-neutral-700">
		<span use:melt={$range} class="h-1.5 rounded-full bg-magnum-400" />
	</span>
	<span
		use:melt={$thumbs[0]}
		class="size-6 block rounded-full bg-white shadow focus:ring-4 focus:ring-magnum-600 dark:bg-white dark:shadow-none"
	/>
</span>
