<script lang="ts">
	import { createSortable, melt } from '$lib';
	import { writable } from 'svelte/store';
	import Slider from './slider.svelte';

	const zones = {
		zoneA: ['1', '2'],
		zoneB: ['3'],
	};

	let duration = writable([150]);

	const {
		elements: { zone, item },
		options,
	} = createSortable({ animationDuration: $duration[0] });

	$: options.animationDuration.set($duration[0]);
</script>

<div class="mx-auto flex w-[18rem] max-w-full flex-col gap-1.5 rounded-md">
	{#each Object.entries(zones) as [zoneName, zoneItems]}
		<span class="font-bold text-white">{zoneName}</span>
		<div class="flex flex-col gap-1.5 rounded bg-white p-2">
			<div
				class="flex min-h-[5px] flex-col gap-1.5"
				use:melt={$zone({
					id: zoneName,
					fromZones: '*',
				})}
			>
				{#each zoneItems as zoneItem}
					<div
						class="group flex cursor-move select-none items-center gap-3 rounded border border-transparent bg-magnum-500 p-1 text-white data-[sortable-dragging]:border-magnum-500 data-[sortable-dragging]:bg-magnum-300 data-[melt-sortable-ghost]:opacity-50"
						use:melt={$item({ id: zoneItem })}
					>
						<span class="group-data-[sortable-dragging]:opacity-0">
							{zoneItem}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<Slider bind:duration />
</div>
