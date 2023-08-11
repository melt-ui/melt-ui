<script lang="ts">
	import { createSortable, melt } from '$lib';

	const {
		elements: { zone, item },
	} = createSortable();

	const zoneItems = ['Svelte', 'JavaScript', 'TypeScript'];
</script>

<div class="mx-auto flex w-[18rem] max-w-full rounded-md">
	<div class="flex flex-col gap-3">
		<!-- Tags -->
		<div
			class="flex w-full place-content-center gap-1.5 rounded bg-white p-2"
			use:melt={$zone({
				id: 'Tags',
				orientation: 'horizontal',
			})}
		>
			{#each zoneItems as zoneItem}
				<div
					class="group flex cursor-move select-none items-center gap-3 rounded border border-transparent bg-magnum-500 p-1 text-white data-[melt-sortable-item-dragging]:border-magnum-500 data-[melt-sortable-item-dragging]:bg-magnum-300"
					use:melt={$item({ id: zoneItem })}
				>
					<span class="group-data-[melt-sortable-item-dragging]:opacity-0"
						>{zoneItem}</span
					>
				</div>
			{/each}
		</div>

		<!-- Dropzone -->
		<div
			class="group flex min-h-[3.5rem] w-72 flex-row place-content-center items-center gap-1.5 rounded border-2 border-dashed border-neutral-50 p-2 transition-all duration-1000 data-[melt-sortable-zone-focus]:border-solid"
			use:melt={$zone({
				id: 'Dropzone',
				orientation: 'horizontal',
				dropzone: true,
				fromZones: ['Tags'],
			})}
		>
			<span
				class="text-center group-data-[melt-sortable-zone-focus]:hidden [&:not(:last-child)]:hidden"
				>Dropzone</span
			>
		</div>
	</div>
</div>

<style lang="postcss">
	[data-melt-sortable-ghost] {
		@apply opacity-50;
	}
</style>
