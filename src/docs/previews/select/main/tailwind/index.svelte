<script lang="ts">
	import { createSelect, melt } from '$lib/index.js';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { valueLabel, open },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true,
		},
	});

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<form method="POST" class="flex flex-col gap-1">
	<input name="firstname" />
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="block text-magnum-900" use:melt={$label}>Favorite Flavor</label>
	<button
		class="flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3
	py-2 text-magnum-700 transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$valueLabel || 'Select a flavor'}
		<ChevronDown class="square-5" />
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[300px] flex-col
		overflow-y-auto rounded-md bg-white
		p-1 focus:!ring-0"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
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
							class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
						focus:z-10 focus:text-magnum-700
					data-[highlighted]:bg-magnum-50 data-[selected]:bg-magnum-100
					data-[highlighted]:text-magnum-900 data-[selected]:text-magnum-900"
							use:melt={$option({ value: item, label: item })}
						>
							{#if $isSelected(item)}
								<div class="check">
									<Check class="square-4" />
								</div>
							{/if}
							{item}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</form>

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
