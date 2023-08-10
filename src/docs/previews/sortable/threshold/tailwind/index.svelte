<script lang="ts">
	import { createSortable, melt, type SortableOrientation } from '$lib';
	import { writable } from 'svelte/store';
	import Select from './select.svelte';
	import Slider from './slider.svelte';

	const zoneItems = ['1', '2'];

	const {
		elements: { zone, item },
	} = createSortable();

	let threshold = writable([0.5]);
	let currentOrientation = writable<SortableOrientation>('vertical');
</script>

<!-- Orientation Selector -->
<div class="absolute left-3 top-3">
	<Select
		orientations={['vertical', 'horizontal', 'both']}
		bind:currentOrientation
	/>
</div>

<div
	class="relative mx-auto flex w-[18rem] max-w-full items-center rounded-md {$currentOrientation ===
	'horizontal'
		? 'flex-col gap-5'
		: 'flex-row justify-center gap-14'}"
>
	<div
		class="flex place-content-center items-center overflow-hidden rounded p-2 {$currentOrientation ===
		'horizontal'
			? 'w-full flex-row gap-8'
			: 'flex-col gap-5'}"
		use:melt={$zone({
			id: 'Example',
			orientation: $currentOrientation,
			threshold: $threshold[0],
		})}
	>
		{#each zoneItems as zoneItem}
			<div
				class="group relative flex h-20 w-20 cursor-move select-none items-center justify-center gap-3 rounded bg-magnum-500 text-white data-[melt-sortable-item-dragging]:border-2 data-[melt-sortable-item-dragging]:border-white data-[melt-sortable-item-dragging]:bg-magnum-400 data-[melt-sortable-ghost]:opacity-50"
				use:melt={$item({ id: zoneItem })}
			>
				<div
					class="thresholdBg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-magnum-700 group-data-[melt-sortable-ghost]:opacity-0 group-data-[melt-sortable-item-dragging]:opacity-0"
					style="height: {$currentOrientation !== 'horizontal'
						? $threshold[0] * 100
						: 100}%;
								width: {$currentOrientation !== 'vertical' ? $threshold[0] * 100 : 100}%;"
				/>
				<span
					class="z-10 text-xl group-data-[melt-sortable-item-dragging]:opacity-0"
					>{zoneItem}</span
				>
			</div>
		{/each}
	</div>

	<Slider bind:threshold bind:currentOrientation />
</div>

<style lang="postcss">
	[data-melt-sortable-ghost] {
		@apply opacity-50;
	}
</style>
