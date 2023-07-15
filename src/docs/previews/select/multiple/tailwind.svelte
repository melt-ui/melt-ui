<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	// value should be a `Writable<unknown[]>` type but it's not working yet
	const { label, trigger, menu, option, isSelected, group, groupLabel, value } =
		createSelect({
			type: 'multiple',
		});

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<button class="trigger" melt={$trigger} aria-label="Food">
	{$label || 'Select an option'}
	<ChevronDown />
</button>

<div class="menu" melt={$menu}>
	{#each Object.entries(options) as [key, arr]}
		<div melt={$group(key)}>
			<div class="label" melt={$groupLabel(key)}>{key}</div>
			{#each arr as item}
				<div class="option" melt={$option({ value: item, label: item })}>
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
		@apply flex h-10 min-w-[220px] max-w-[220px] items-center justify-between rounded-md bg-white px-3;
		@apply overflow-hidden whitespace-nowrap py-2 text-magnum-700 transition-opacity hover:opacity-90;
	}
	.check {
		@apply absolute left-2 top-1/2 z-20 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
