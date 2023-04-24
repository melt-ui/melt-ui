<script lang="ts">
	import { Collapsible } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Cross2Icon from '~icons/radix-icons/cross-2';
	import RowSpacingIcon from '~icons/radix-icons/row-spacing';

	export let propsObj: ResolvedProps<typeof Collapsible>;

	// Set defaults for the example
	propsObj.Content.transition = true;
</script>

<Collapsible.Root bind:open={propsObj.Root.open} disabled={propsObj.Root.disabled} class="w-full">
	<div class="flex items-center justify-between">
		<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
		<Collapsible.Trigger
			class="inline-grid h-6 w-6 place-items-center rounded-full bg-white  text-sm text-vermilion-700
			shadow-lg outline-none hover:opacity-75 focus:ring focus:ring-black 
			data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
		>
			{#if propsObj.Root.open}
				<Cross2Icon />
			{:else}
				<RowSpacingIcon />
			{/if}
		</Collapsible.Trigger>
	</div>

	<div class="my-2 rounded bg-white p-3 shadow-lg">
		<span class="text-base leading-[25px] text-vermilion-800">tglide/radix-svelte</span>
	</div>

	<Collapsible.Content transition={propsObj.Content.transition}>
		<div class="flex flex-col gap-2">
			<div class="rounded bg-white p-3 shadow-lg">
				<span class="text-base leading-[25px] text-vermilion-800">sveltejs/svelte</span>
			</div>
			<div class="rounded bg-white p-3 shadow-lg">
				<span class="text-base leading-[25px] text-vermilion-800">sveltejs/kit</span>
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
