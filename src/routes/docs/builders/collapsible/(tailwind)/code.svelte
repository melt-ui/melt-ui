<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import { X, ChevronsUpDown } from 'icons';

	const { open, root, content, trigger } = createCollapsible();
</script>

<div {...$root} class="mx-auto w-full max-w-md">
	<div class="flex items-center justify-between">
		<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
		<button
			{...$trigger}
			use:trigger.action
			class="relative h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
        shadow-lg hover:opacity-75
        data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
		>
			<div class="abs-center">
				{#if $open}
					<X />
				{:else}
					<ChevronsUpDown />
				{/if}
			</div>
		</button>
	</div>

	<div class="my-2 rounded bg-white p-3 shadow-lg">
		<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
	</div>

	{#if $open}
		<div {...$content} transition:slide|local>
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

<style>
	.abs-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
