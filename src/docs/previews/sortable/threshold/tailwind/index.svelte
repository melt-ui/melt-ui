<script lang="ts">
	import {
		createSortable,
		melt,
		type SelectOption,
		type SortableOrientation,
	} from '$lib';
	import { writable } from 'svelte/store';
	import Select from './select.svelte';
	import Slider from './slider.svelte';

	const zoneItems = ['1', '2'];

	const {
		elements: { zone, item },
	} = createSortable();

	let threshold = writable([0.5]);
	export let currentOrientation = writable<SelectOption<SortableOrientation>>({
		value: 'vertical',
		label: 'Vertical',
	});
</script>

<!-- Orientation Selector -->
<Select
	orientations={['vertical', 'horizontal', 'both']}
	bind:currentOrientation
/>

<div
	class="relative mx-auto flex w-[18rem] max-w-full items-center rounded-md {$currentOrientation.value ===
	'horizontal'
		? 'flex-col gap-5'
		: 'flex-row justify-center gap-14'}"
>
	<div
		class="flex place-content-center items-center overflow-hidden rounded p-2 {$currentOrientation.value ===
		'horizontal'
			? 'w-full flex-row gap-8'
			: 'flex-col gap-5'}"
		use:melt={$zone({
			id: 'Example',
			orientation: $currentOrientation.value,
			threshold: $threshold[0],
		})}
	>
		{#each zoneItems as zoneItem}
			<div
				class="group relative flex h-20 w-20 cursor-move select-none items-center justify-center gap-3 rounded bg-magnum-500 text-white data-[sortable-dragging]:border-2 data-[sortable-dragging]:border-white data-[sortable-dragging]:bg-magnum-400 data-[melt-sortable-ghost]:opacity-50"
				use:melt={$item({ id: zoneItem })}
			>
				<div
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-magnum-700 group-data-[melt-sortable-ghost]:opacity-0 group-data-[sortable-dragging]:opacity-0"
					style:height="{$currentOrientation.value !== 'horizontal'
						? $threshold[0] * 100
						: 100}%"
					style:width="{$currentOrientation.value !== 'vertical'
						? $threshold[0] * 100
						: 100}%"
				/>
				<span class="z-10 text-xl group-data-[sortable-dragging]:opacity-0"
					>{zoneItem}</span
				>
			</div>
		{/each}
	</div>

	<Slider bind:threshold bind:currentOrientation />
</div>
