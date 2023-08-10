<script lang="ts">
	import { createSelect, melt, type SortableOrientation } from '$lib';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	export let orientations: SortableOrientation[];
	export let currentOrientation = writable<SortableOrientation>('vertical');

	const {
		elements: { trigger, menu, option },
		states: { valueLabel, open },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		defaultValueLabel: $currentOrientation,
		value: currentOrientation,
	});
</script>

<div class="flex flex-col gap-1">
	<button
		class="flex h-10 min-w-[130px] items-center justify-between rounded-md bg-white px-3
	py-2 text-magnum-700 transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$valueLabel || ''}
		<ChevronDown class="square-5" />
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[360px] flex-col overflow-y-auto rounded-md bg-white p-1 focus:!ring-0"
			use:melt={$menu}
			transition:fly={{ duration: 100, y: -5 }}
		>
			{#each orientations as orientation}
				<div
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800 focus:z-10 focus:text-magnum-700 data-[highlighted]:bg-magnum-50 data-[selected]:bg-magnum-100 data-[highlighted]:text-magnum-900 data-[selected]:text-magnum-900"
					use:melt={$option({ value: orientation, label: orientation })}
				>
					{#if $isSelected(orientation)}
						<div class="check">
							<Check class="square-4" />
						</div>
					{/if}
					{orientation}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.check {
		position: absolute;
		left: theme(spacing.2);
		top: 50%;
		z-index: theme(zIndex.20);
		translate: 0 calc(-50% + 1px);
		color: theme(colors.magnum.500);
	}
</style>
