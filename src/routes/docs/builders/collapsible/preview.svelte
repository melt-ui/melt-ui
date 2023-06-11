<script lang="ts">
	import { createCollapsible } from '$lib/builders/collapsible';
	import X from '~icons/lucide/x';
	import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
	import { slide } from 'svelte/transition';
	import { Docs } from '$routes/(components)';

	const { open, root, content, trigger } = createCollapsible();
</script>

<Docs.PreviewWrapper>
	<div {...$root} class="w-full">
		<div class="flex items-center justify-between">
			<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
			<button
				{...$trigger}
				class="relative h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
			shadow-lg outline-none hover:opacity-75 focus:ring focus:ring-magnum-400
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
</Docs.PreviewWrapper>

<style>
	.abs-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
