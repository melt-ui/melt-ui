<script lang="ts">
	import {
		createSlider,
		createSortable,
		melt,
		type SortableOrientation,
	} from '$lib';
	import { writable } from 'svelte/store';

	const zoneItems = ['1', '2'];

	//  Sortable
	const {
		elements: { zone, item },
	} = createSortable();

	let threshold = writable([0.5]);
	let orientation: SortableOrientation = 'vertical';

	// Slider
	const {
		elements: { root: sliderRoot, range: sliderRange, thumb: sliderThumb },
	} = createSlider({
		min: 0,
		max: 1,
		defaultValue: $threshold,
		value: threshold,
		step: 0.01,
		// orientation: orientation === 'horizontal' ? 'horizontal' : orientation,
	});
</script>

<div
	class="mx-auto flex w-[18rem] max-w-full gap-5 rounded-md {orientation ===
	'horizontal'
		? 'flex-col'
		: ' flex-row'}"
>
	<div
		class="flex w-full place-content-center items-center gap-5 rounded p-2 {orientation ===
		'horizontal'
			? 'flex-row'
			: ' flex-col'}"
		use:melt={$zone({
			id: 'Example',
			orientation: orientation,
			threshold: $threshold[0],
		})}
	>
		{#each zoneItems as zoneItem}
			<div
				class="group relative flex h-20 w-20 cursor-move select-none items-center justify-center gap-3 rounded bg-magnum-500 text-white data-[melt-item-dragging]:border-2 data-[melt-item-dragging]:border-white data-[melt-item-dragging]:bg-magnum-400 group-data-[melt-ghost]:opacity-50"
				use:melt={$item({ id: zoneItem })}
			>
				<div
					class="thresholdBg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-magnum-700 group-data-[melt-ghost]:opacity-0 group-data-[melt-item-dragging]:opacity-0"
					style="height: {orientation !== 'horizontal'
						? $threshold[0] * 100
						: 100}%;
								width: {orientation !== 'vertical' ? $threshold[0] * 100 : 100}%;"
				/>
				<span class="z-10 text-xl group-data-[melt-item-dragging]:opacity-0"
					>{zoneItem}</span
				>
			</div>
		{/each}
	</div>

	<!-- Slider -->
	<span
		use:melt={$sliderRoot}
		class="relative flex w-[3px] flex-col items-center"
	>
		<span class="block h-[200px] w-full bg-black/40">
			<span use:melt={$sliderRange} class="w-full bg-white" />
		</span>
		<span
			use:melt={$sliderThumb()}
			class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
		/>
	</span>
</div>

<style lang="postcss">
	[data-melt-ghost] {
		@apply opacity-50;
	}
</style>
