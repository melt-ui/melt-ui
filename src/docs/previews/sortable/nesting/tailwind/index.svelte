<script lang="ts">
	import { createSortable, melt } from '$lib';

	const {
		elements: { zone, item },
	} = createSortable({ animationDuration: 150 });
</script>

<div class="mx-auto flex w-[18rem] max-w-full flex-col gap-1.5 rounded-md">
	<div class="flex flex-col gap-1.5 rounded bg-white p-1.5">
		<!-- Zone 1 -->
		<div
			class="flex flex-col gap-1.5"
			use:melt={$zone({ id: 'zone 1', fromZones: '*', nesting: true })}
		>
			<!-- Item 1 -->
			<div class="item group bg-magnum-500" use:melt={$item({ id: 'item 1' })}>
				<span
					class="w-full text-start group-data-[sortable-dragging]:opacity-0"
				>
					Item 1
				</span>

				<!--Item 1.1 -->
				<div
					class="item group bg-magnum-400"
					use:melt={$item({ id: 'item 1.1' })}
				>
					<span
						class="w-full text-start group-data-[sortable-dragging]:opacity-0"
					>
						Item 1.1
					</span>

					<!--Item 1.1.1 -->
					<div
						class="item group bg-magnum-600"
						use:melt={$item({ id: 'item 1.1.1' })}
					>
						<span
							class="w-full text-start group-data-[sortable-dragging]:opacity-0"
						>
							Item 1.1.1
						</span>
					</div>
				</div>
			</div>

			<!--Item 2 -->
			<div class="item group bg-magnum-700" use:melt={$item({ id: 'item 2' })}>
				<span
					class="w-full text-start group-data-[sortable-dragging]:opacity-0"
				>
					Item 2
				</span>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.item-group {
		@apply flex min-h-[1rem] flex-col gap-1;
	}

	.item {
		@apply flex w-full cursor-move select-none flex-col items-center gap-1 rounded border px-1.5 py-2.5;
		@apply border-white text-white;
		@apply data-[sortable-dragging]:border-magnum-500 data-[sortable-dragging]:bg-magnum-300;
		@apply data-[melt-sortable-ghost]:opacity-50;
	}
</style>
