<script lang="ts">
	import { Collapsible } from '$lib';
	import Cross2Icon from '~icons/radix-icons/cross-2';
	import RowSpacingIcon from '~icons/radix-icons/row-spacing';

	export let open = false;
	export let disabled = false;
</script>

<Collapsible.Root bind:open {disabled}>
	<div class="flex items-center justify-between">
		<span class="text-violet11 text-sm leading-6 text-white">
			@peduarte starred 3 repositories
		</span>
		<Collapsible.Trigger
			class="inline-grid h-6 w-6 place-items-center rounded-full text-sm  text-violet-500 shadow-[0_2px_10px]
			shadow-gray-600 outline-none hover:bg-violet-300 focus:ring focus:ring-gray-800 data-[disabled]:cursor-not-allowed 
			data-[state=closed]:bg-white data-[state=open]:bg-violet-100 data-[disabled]:opacity-75"
		>
			{#if open}
				<Cross2Icon />
			{:else}
				<RowSpacingIcon />
			{/if}
		</Collapsible.Trigger>
	</div>

	<div class="my-2 rounded bg-white p-3 shadow-[0_2px_10px] shadow-gray-600">
		<span class="text-base leading-[25px] text-violet-800">@radix-ui/primitives</span>
	</div>

	<Collapsible.Content transition={{ duration: 300 }}>
		<div class="flex flex-col gap-2">
			<div class="rounded bg-white p-3 shadow-[0_2px_10px] shadow-gray-600">
				<span class="text-base leading-[25px] text-violet-800">@radix-ui/colors</span>
			</div>
			<div class="rounded bg-white p-3 shadow-[0_2px_10px] shadow-gray-600">
				<span class="text-base leading-[25px] text-violet-800">@stitches/react</span>
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
