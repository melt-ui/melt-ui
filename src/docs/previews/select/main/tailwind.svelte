<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	const {
		valueLabel,
		trigger,
		menu,
		option,
		isSelected,
		group,
		groupLabel,
		label,
	} = createSelect();

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="block" melt={$label}>Favorite Flavor</label>
	<button
		class="flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3
	py-2 text-magnum-700 transition-opacity hover:opacity-90"
		melt={$trigger}
		aria-label="Food"
	>
		{$valueLabel || 'Select a flavor'}
		<ChevronDown />
	</button>

	<div
		class="z-10 flex max-h-[360px] flex-col
		overflow-y-auto rounded-md bg-white
		p-1 focus:!ring-0"
		melt={$menu}
	>
		{#each Object.entries(options) as [key, arr]}
			<div melt={$group(key)}>
				<div
					class="py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800"
					melt={$groupLabel(key)}
				>
					{key}
				</div>
				{#each arr as item}
					<div
						class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
						focus:z-10 focus:text-magnum-700
					data-[highlighted]:bg-magnum-50 data-[selected]:bg-magnum-100
					data-[highlighted]:text-magnum-900 data-[selected]:text-magnum-900"
						melt={$option({ value: item, label: item })}
					>
						{#if $isSelected(item)}
							<div class="check">
								<Check />
							</div>
						{/if}
						{item}
					</div>
				{/each}
			</div>
		{/each}
	</div>
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
