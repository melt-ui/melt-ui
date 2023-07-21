<script lang="ts">
	import { createProgress } from '@melt-ui/svelte';

	const {
		elements: { root },
		states: { value },
		options: { max },
	} = createProgress({
		defaultValue: 30,
		max: 100,
	});

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	sleep(1000).then(() => {
		value.set(75);
	});
</script>

<div
	melt={$root}
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
