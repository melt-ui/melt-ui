<script lang="ts">
	import { Collapsible, type CollapsibleContentProps } from '$lib';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
	import X from '~icons/lucide/x';

	export let open: boolean;
	export let disabled: boolean;
	export let transition: CollapsibleContentProps['transition'];
</script>

<div class="mx-auto flex max-w-lg justify-center">
	<Collapsible.Root bind:open {disabled} class="w-full">
		<div class="flex items-center justify-between">
			<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
			<Collapsible.Trigger
				class="inline-grid h-6 w-6 place-items-center rounded-full bg-white  text-sm text-magnum-700
			shadow-lg outline-none hover:opacity-75 focus:ring focus:ring-magnum-400 
			data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
			>
				{#if open}
					<X />
				{:else}
					<ChevronsUpDown />
				{/if}
			</Collapsible.Trigger>
		</div>

		<div class="my-2 rounded bg-white p-3 shadow-lg">
			<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
		</div>

		<Collapsible.Content {transition}>
			<div class="flex flex-col gap-2">
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/svelte</span>
				</div>
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/kit</span>
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
