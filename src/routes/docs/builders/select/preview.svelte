<script lang="ts">
	import { createSelect } from '$lib';
	import { Docs } from '$routes/(components)';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	const { selectedText, trigger, menu, option, isSelected } = createSelect();

	const options = {
		fruits: ['Apple', 'Banana', 'Pineapple'],
		vegetables: ['Broccoli', 'Potato', 'Tomato'],
	};
</script>

<Docs.PreviewWrapper>
	<button class="trigger" {...$trigger} aria-label="Food">
		{$selectedText || 'Select an option'}
		<ChevronDown />
	</button>

	<ul class="menu" {...$menu}>
		{#each Object.entries(options) as [key, arr]}
			<li class="label">{key}</li>
			{#each arr as item}
				<li class="option" {...$option({ value: item })}>
					{#if $isSelected(item)}
						<div class="check">
							<Check />
						</div>
					{/if}
					{item}
				</li>
			{/each}
		{/each}
	</ul>
</Docs.PreviewWrapper>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[360px] flex-col gap-2 overflow-y-auto;
		@apply rounded-md bg-white p-1;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:bg-magnum-100 focus:text-magnum-700;
	}
	.trigger {
		@apply flex h-10 w-[180px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700  hover:opacity-75;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
