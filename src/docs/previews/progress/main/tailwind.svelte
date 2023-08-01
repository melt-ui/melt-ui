<script lang="ts">
	import { createProgress, melt } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';

	const value = writable(30);

	const {
		elements: { root },
		options: { max },
	} = createProgress({
		value,
		max: 100,
	});

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	sleep(1000).then(() => {
		value.set(75);
	});
</script>

<div
	use:melt={$root}
	class="relative h-6 w-[300px] overflow-hidden rounded-[99999px] bg-black/40"
>
	<div
		class="h-full w-full bg-[white] transition-transform duration-[660ms]
        ease-[cubic-bezier(0.65,0,0.35,1)]"
		style={`transform: translateX(-${
			100 - (100 * ($value ?? 0)) / ($max ?? 1)
		}%)`}
	/>
</div>
