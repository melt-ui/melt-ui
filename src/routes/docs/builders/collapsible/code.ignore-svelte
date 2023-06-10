<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import { X, ChevronsUpDown } from 'icons'; // Be sure to use your own icons, this is just for the demo!

	const { open, root, content, trigger } = createCollapsible();
</script>

<div {...$root}>
	<div class="flex items-center justify-between">
		<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
		<button
			{...$trigger}
			class="inline-grid h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
			shadow-lg outline-none hover:opacity-75 focus:ring focus:ring-black
			data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
		>
			{#if $open}
				<X />
			{:else}
				<ChevronsUpDown />
			{/if}
		</button>
	</div>

	<div class="my-2 rounded bg-white p-3 shadow-lg">
		<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
	</div>

	{#if $open}
		<div {...$content} transition:slide>
			<div class="flex flex-col gap-2">
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/svelte</span>
				</div>
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/kit</span>
				</div>
			</div>
		</div>
	{/if}
</div>
