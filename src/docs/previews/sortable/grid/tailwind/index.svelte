<script lang="ts">
	import { createSortable, melt } from '$lib';

	const {
		elements: { zone, item },
	} = createSortable({ animationDuration: 1000 });
</script>

<div class="mx-auto flex max-w-full place-content-center gap-1.5 rounded-md">
	<div
		class="grid grid-cols-2 gap-1.5 rounded border p-2"
		use:melt={$zone({
			id: 'grid test 1',
			orientation: 'both',
			fromZones: '*',
		})}
	>
		<div class="item group h-5 w-5" use:melt={$item({ id: '1' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				1
			</span>
		</div>
		<div class="item group h-20 w-20" use:melt={$item({ id: '2' })}>
			<span
				class="z-20 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				2
			</span>
		</div>
		<div class="item group h-20 w-24" use:melt={$item({ id: '3' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				3
			</span>
		</div>
		<div class="item group h-5 w-5" use:melt={$item({ id: '4' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				4
			</span>
		</div>
	</div>

	<div
		class="flex max-w-[140px] flex-wrap gap-1.5 rounded border p-2"
		use:melt={$zone({
			id: 'grid test 2',
			orientation: 'both',
			fromZones: '*',
		})}
	>
		<div class="item group h-5 w-5" use:melt={$item({ id: 'b_1' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				1
			</span>
		</div>
		<div class="item group h-20 w-20" use:melt={$item({ id: 'b_2' })}>
			<span
				class="z-20 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				2
			</span>
		</div>
		<div class="item group h-20 w-24" use:melt={$item({ id: 'b_3' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				3
			</span>
		</div>
		<div class="item group h-5 w-5" use:melt={$item({ id: 'b_4' })}>
			<span
				class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
			>
				4
			</span>
		</div>
	</div>
</div>

<style lang="postcss">
	.item {
		@apply relative flex cursor-move select-none items-center justify-center gap-3 rounded;
		@apply bg-magnum-500 text-white;
		@apply data-[melt-sortable-item-dragging]:border-2 data-[melt-sortable-item-dragging]:border-white data-[melt-sortable-item-dragging]:bg-magnum-400 data-[melt-sortable-ghost]:opacity-50;
	}
</style>
