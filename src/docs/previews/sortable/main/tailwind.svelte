<script lang="ts">
	import { createSortable, melt } from '$lib';
	import { GripVertical } from 'lucide-svelte';

	const {
		elements: { zone, item, handle },
	} = createSortable({ animationDuration: 200 });

	const zones = {
		Todo: ['Build sortable component', 'Write unit tests'],
		Done: ['Give Melt UI repo a star'],
	};
</script>

<div class="mx-auto flex w-[18rem] max-w-full flex-col gap-1.5 rounded-md">
	{#each Object.entries(zones) as [zoneName, zoneItems]}
		<span class="font-bold text-white">{zoneName}</span>
		<div class="flex flex-col gap-1.5 rounded bg-white p-2">
			<div
				class="flex min-h-[5px] flex-col gap-1.5"
				use:melt={$zone({
					id: zoneName,
					orientation: 'vertical',
					fromZones: '*',
				})}
			>
				{#each zoneItems as zoneItem}
					<div
						class="group flex select-none items-center gap-3 rounded border border-transparent bg-magnum-500 p-1 text-white data-[melt-item-dragging]:border-magnum-500 data-[melt-item-dragging]:bg-magnum-300 data-[melt-ghost]:opacity-50"
						use:melt={$item({ id: zoneItem })}
					>
						<span
							use:melt={$handle}
							class="cursor-move group-data-[melt-item-dragging]:cursor-default group-data-[melt-item-dragging]:opacity-0"
						>
							<GripVertical class="h-4 w-4" />
						</span>
						<span class="group-data-[melt-item-dragging]:opacity-0"
							>{zoneItem}</span
						>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
