<script lang="ts">
	import { createSelect, melt } from '$lib';
	import { Check, ChevronDown } from 'lucide-svelte';

	export let multiple = false;

	const {
		elements: { trigger, menu, option, group, groupLabel },
		states: { valueLabel },
		helpers: { isSelected },
	} = createSelect({ multiple });

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<main>
	<button class="trigger" use:melt={$trigger} aria-label="Food" data-testid="trigger">
		{$valueLabel || 'Select an option'}
		<ChevronDown />
	</button>

	<div class="menu" use:melt={$menu} data-testid="menu">
		{#each Object.entries(options) as [key, arr]}
			<div use:melt={$group(key)} data-testid="group-{key}">
				<div class="label" use:melt={$groupLabel(key)} data-testid="label-{key}">{key}</div>
				{#each arr as item, i}
					<div
						class="option"
						use:melt={$option({ value: item, label: item, disabled: i === 2 })}
						data-testid="{key}-option-{i}"
					>
						{#if $isSelected(item)}
							<div class="check" data-testid="check-{i}">
								<Check />
							</div>
						{/if}
						{item}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4  font-semibold capitalize text-neutral-800;
	}

	.menu {
		@apply z-10 flex max-h-[360px]  flex-col overflow-y-auto;
		@apply rounded-md bg-white p-1;
		@apply ring-0 !important;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:z-10 focus:text-magnum-700;
		@apply data-[highlighted]:bg-magnum-50 data-[highlighted]:text-magnum-900;
		@apply data-[selected]:bg-magnum-100 data-[selected]:text-magnum-900;
	}
	.trigger {
		@apply flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700 transition-opacity hover:opacity-90;
	}
	.check {
		@apply absolute left-2 top-1/2 z-20 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
