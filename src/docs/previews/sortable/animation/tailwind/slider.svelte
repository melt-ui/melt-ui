<script lang="ts">
	import { createSlider, createTooltip, melt } from '$lib';
	import { writable } from 'svelte/store';

	export let duration = writable([150]);

	const {
		elements: { root, range, thumb },
	} = createSlider({
		min: 0,
		max: 5000,
		defaultValue: $duration,
		value: duration,
		step: 50,
		orientation: 'horizontal',
	});

	const {
		elements: { trigger, content, arrow },
	} = createTooltip({
		positioning: {
			placement: 'bottom',
		},
		defaultOpen: true,
		closeOnPointerDown: false,
		forceVisible: true,
	});
</script>

<span
	use:melt={$root}
	class="relative flex h-[20px] w-full flex-row place-content-center items-center justify-center pt-5"
>
	<span class="block h-[3px] w-full bg-black/40">
		<span use:melt={$range} class="h-[3px] bg-white" />
	</span>
	<span
		use:melt={$thumb()}
		use:melt={$trigger}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>

<div use:melt={$content} class="z-10 rounded-md bg-white">
	<div use:melt={$arrow} />
	<p class="px-2 py-1 text-xs text-magnum-700">{$duration[0]}ms</p>
</div>
