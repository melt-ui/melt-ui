<script lang="ts">
	import {
		createProgress,
		melt,
		type Toast,
		type ToastsElements,
	} from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import type { ToastData } from './index.svelte';
	import { X } from '$icons/index.js';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let elements: ToastsElements;
	$: ({ content, title, description, close } = elements);

	export let toast: Toast<ToastData>;
	$: ({ data, id, getPercentage } = toast);

	const percentage = writable(0);
	const {
		elements: { root: progress },
		options: { max },
	} = createProgress({
		max: 100,
		value: percentage,
	});

	onMount(() => {
		let frame: number;
		const updatePercentage = () => {
			percentage.set(getPercentage());
			frame = requestAnimationFrame(updatePercentage);
		};
		frame = requestAnimationFrame(updatePercentage);

		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	use:melt={$content(id)}
	in:fly={{ duration: 150, x: '100%' }}
	out:fly={{ duration: 150, x: '100%' }}
	class="relative rounded-lg bg-neutral-800 text-white shadow-md"
>
	<div
		use:melt={$progress}
		class="absolute left-5 top-2 h-1 w-[10%] overflow-hidden rounded-full bg-black/40"
	>
		<div
			class="h-full w-full bg-magnum-500"
			style={`transform: translateX(-${
				100 - (100 * ($percentage ?? 0)) / ($max ?? 1)
			}%)`}
		/>
	</div>

	<div
		class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5 pt-6"
	>
		<div>
			<h3 use:melt={$title(id)} class="flex items-center gap-2 font-semibold">
				{data.title}
				<span class="size-1.5 rounded-full {data.color}" />
			</h3>
			<div use:melt={$description(id)}>
				{data.description}
			</div>
		</div>
		<button
			use:melt={$close(id)}
			class="absolute right-4 top-4 grid size-6 place-items-center rounded-full text-magnum-500
					hover:bg-magnum-900/50"
		>
			<X class="size-4" />
		</button>
	</div>
</div>
