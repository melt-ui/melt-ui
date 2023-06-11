<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { Docs } from '$routes/(components)';

	const { trigger, popover, open, arrow } = createPopover();
</script>

<Docs.PreviewWrapper>
	<button
		type="button"
		class="rounded-md bg-white px-4 py-1 text-magnum-700 outline-none
hover:opacity-75 focus:ring focus:ring-black"
		{...$trigger()}
	>
		Open Popover
	</button>

	{#if $open}
		<div
			{...$popover}
			class="flex min-w-[200px] flex-col gap-2 rounded-md bg-white p-2 text-magnum-700"
			aria-label="Update Settings"
		>
			<div class="p-4">
				<input type="text" class="w-full rounded-md border border-magnum-300 p-2" />
				<p class="text-magnum-700">Popover content</p>
			</div>
			<div {...$arrow} />
		</div>
	{/if}
</Docs.PreviewWrapper>
