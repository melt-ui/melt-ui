<script lang="ts">
	import { createSortable, melt } from '$lib';

	const {
		elements: { zone, item },
	} = createSortable({ animationDuration: 200 });
</script>

<div class="mx-auto flex w-[18rem] max-w-full flex-col gap-1.5 rounded-md">
	<div class="flex flex-col gap-1.5 rounded bg-white p-2">
		<!-- Zone 1 -->
		<div
			class="flex flex-col gap-1.5"
			use:melt={$zone({ id: 'zone 1', fromZones: '*', nesting: true })}
		>
			<!-- Item 1 -->
			<div
				class="item group flex flex-col bg-magnum-500"
				use:melt={$item({ id: 'item 1' })}
			>
				<span
					class="w-full text-start group-data-[sortable-dragging]:opacity-0"
				>
					Item 1
				</span>
				<!--Item 1.1 -->
				<div
					class="item group w-full bg-magnum-700"
					use:melt={$item({ id: 'item 1.1' })}
				>
					<span class="group-data-[sortable-dragging]:opacity-0">
						Item 1.1
					</span>
				</div>
				<!--Item 1.2 -->
				<div
					class="item group flex w-full flex-col bg-magnum-700"
					use:melt={$item({ id: 'item 1.2' })}
				>
					<span
						class="w-full text-start group-data-[sortable-dragging]:opacity-0"
					>
						Item 1.2
					</span>
					<div
						class="item group w-full bg-magnum-800"
						use:melt={$item({ id: 'item 1.2.1' })}
					>
						<span class="group-data-[sortable-dragging]:opacity-0">
							Item 1.2.1
						</span>
					</div>
				</div>
			</div>
			<div
				class="item group flex flex-col bg-magnum-500"
				use:melt={$item({ id: 'item 2' })}
			>
				<span
					class="w-full text-start group-data-[sortable-dragging]:opacity-0"
				>
					Item 2
				</span>
			</div>
		</div>
	</div>

	<!-- <div class="flex flex-col gap-1.5 rounded bg-white p-2">
		<div
			class="flex flex-col gap-1.5"
			use:melt={$zone({ id: 'zone 2', fromZones: '*' })}
		>
			<div
				class="item group flex flex-col bg-magnum-600"
				use:melt={$item({ id: 'item 3' })}
			>
				<span
					class="w-full text-start group-data-[sortable-dragging]:opacity-0"
				>
					Item 3
				</span>
			</div>
		</div>
	</div> -->
</div>

<style lang="postcss">
	.item-group {
		@apply flex min-h-[1rem] flex-col gap-1;
	}

	.item {
		@apply flex cursor-move select-none items-center gap-1 rounded border border-transparent px-1.5 py-4 text-white;
		@apply data-[sortable-dragging]:border-magnum-500 data-[sortable-dragging]:bg-magnum-300;
		@apply data-[melt-sortable-ghost]:opacity-50;
	}
</style>
