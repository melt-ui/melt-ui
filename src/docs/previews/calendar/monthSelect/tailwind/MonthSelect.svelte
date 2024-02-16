<script lang="ts">
	import { createSelect, melt, type CreateSelectProps } from '$lib/index.js';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	const months = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December',
	} as const;

	export let onSelectedChange: CreateSelectProps<
		number,
		false
	>['onSelectedChange'] = undefined;

	export let selected: CreateSelectProps<number, false>['selected'] = undefined;

	const {
		elements: { trigger, menu, option, label },
		states: { selectedLabel, open },
		helpers: { isSelected },
	} = createSelect<number>({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true,
		},
		onSelectedChange,
		selected,
	});
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="block text-sm text-neutral-400" use:melt={$label}
		>Select a month</label
	>
	<button
		class="flex h-8 max-w-[200px] items-center justify-between rounded-lg bg-neutral-800/90 p-3
	px-3 py-2 text-sm text-white shadow transition-opacity hover:opacity-90"
		use:melt={$trigger}
		aria-label="Food"
	>
		{$selectedLabel || 'Select a month'}
		<ChevronDown class="square-5" />
	</button>

	{#if $open}
		<div
			class="z-10 flex max-h-[300px] flex-col
		overflow-y-auto rounded-lg bg-neutral-800 p-1
		text-sm shadow focus:!ring-0"
			use:melt={$menu}
			transition:fade={{ duration: 150 }}
		>
			{#each Object.entries(months) as [value, label]}
				<div
					class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-neutral-100
		hover:bg-neutral-700 focus:z-10
		focus:text-white
							data-[highlighted]:bg-neutral-600 data-[highlighted]:text-white
							data-[disabled]:opacity-50"
					use:melt={$option({ value, label })}
				>
					<div class="check {$isSelected(value) ? 'block' : 'hidden'}">
						<Check class="square-4" />
					</div>
					{label}
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
