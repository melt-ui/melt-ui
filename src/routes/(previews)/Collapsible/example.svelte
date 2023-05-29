<script lang="ts">
	import { Collapsible } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import X from '~icons/lucide/x';
	import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
	import { slide } from 'svelte/transition';

	export let propsObj: ResolvedProps<typeof Collapsible>;

	// Set defaults for the example
	propsObj.Content.transition = true;
</script>

<Collapsible.Root asChild let:root bind:open={propsObj.Root.open} disabled={propsObj.Root.disabled}>
	<div class="child w-full" {...root}>
		<div class="flex items-center justify-between">
			<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
			<Collapsible.Trigger asChild let:trigger>
				<button
					{...trigger}
					class="inline-grid h-6 w-6 place-items-center rounded-full bg-white text-sm text-vermilion-700
			shadow-lg outline-none hover:opacity-75 focus:ring focus:ring-black
			data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
				>
					{#if propsObj.Root.open}
						<X />
					{:else}
						<ChevronsUpDown />
					{/if}
				</button>
			</Collapsible.Trigger>
		</div>

		<div class="my-2 rounded bg-white p-3 shadow-lg">
			<span class="text-base leading-[25px] text-vermilion-800">tglide/radix-svelte</span>
		</div>

		<Collapsible.Content asChild let:content>
			<div class="flex flex-col gap-2" transition:slide {...content}>
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-vermilion-800">sveltejs/svelte</span>
				</div>
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-vermilion-800">sveltejs/kit</span>
				</div>
			</div>
		</Collapsible.Content>
	</div>
</Collapsible.Root>
