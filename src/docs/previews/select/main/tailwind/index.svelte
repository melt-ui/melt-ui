<script lang="ts">
	import { createSelect, melt } from '$lib/index.js';
	import { Check, ChevronDown } from 'lucide-svelte';

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary'],
	};

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selected, open },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true,
		},
	});
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="block text-magnum-900" use:melt={$label}>Favorite Flavor</label>
	<button
		class="flex h-10 min-w-[220px] items-center justify-between rounded-lg bg-white px-3 py-2
	text-magnum-700 shadow transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$selected?.label || 'Select a flavor'}
		<ChevronDown class="square-5" />
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[300px] flex-col
		overflow-y-auto rounded-lg bg-white p-1
		shadow focus:!ring-0"
			use:melt={$menu}
		>
			{#each Object.entries(options) as [key, arr]}
				<div use:melt={$group(key)}>
					<div
						class="py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800"
						use:melt={$groupLabel(key)}
					>
						{key}
					</div>
					{#each arr as item}
						<div
							class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-neutral-800
							focus:z-10 focus:text-magnum-700
						data-[highlighted]:bg-magnum-50 data-[selected]:bg-magnum-100
						data-[highlighted]:text-magnum-900 data-[selected]:text-magnum-900"
							use:melt={$option({ value: item, label: item })}
						>
							<div class="check {$isSelected(item) ? 'block' : 'hidden'}">
								<Check class="square-4" />
							</div>

							{item}
						</div>
					{/each}
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
