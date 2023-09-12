<script lang="ts">
	import { createSortable, melt } from '$lib';

	const {
		elements: { zone, itemGroup, item },
	} = createSortable();
</script>

<div class="mx-auto flex w-[18rem] max-w-full flex-col gap-1.5 rounded-md">
	<div class="flex flex-col rounded bg-white p-2">
		<div
			class="flex flex-col gap-1.5"
			use:melt={$zone({ id: 'zone 1', fromZones: '*' })}
		>
			<!-- Item group 1 -->
			<span class="text-xs font-medium uppercase text-magnum-700">
				High Priority
			</span>
			<div use:melt={$itemGroup} class="item-group">
				<span
					class="text-center text-gray-400 group-data-[sortable-focus]:hidden [&:not(:last-child)]:hidden"
				>
					No Items.
				</span>
				<div class="item group" use:melt={$item({ id: 'item 2' })}>
					<span class="group-data-[sortable-dragging]:opacity-0">
						Complete budget report
					</span>
				</div>
			</div>

			<!-- Item group 2 -->
			<span class="text-xs font-medium uppercase text-magnum-700">
				Low Priority
			</span>
			<div use:melt={$itemGroup} class="item-group">
				<span
					class="text-center text-gray-400 group-data-[sortable-focus]:hidden [&:not(:last-child)]:hidden"
				>
					No Items.
				</span>
				<div class="item group" use:melt={$item({ id: 'item 3' })}>
					<span class="group-data-[sortable-dragging]:opacity-0">
						Review client feedback
					</span>
				</div>
				<div class="item group" use:melt={$item({ id: 'item 4' })}>
					<span class="group-data-[sortable-dragging]:opacity-0">
						Update team meeting agenda
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.item-group {
		@apply flex min-h-[1rem] flex-col gap-1;
	}
	.item {
		@apply flex cursor-move select-none items-center gap-3 rounded border border-transparent bg-magnum-500 p-1 text-white;
		@apply data-[sortable-dragging]:border-magnum-500 data-[sortable-dragging]:bg-magnum-300;
		@apply data-[melt-sortable-ghost]:opacity-50;
	}
</style>
