<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			content: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			content: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			content: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
</script>

<div class="w-full rounded-md bg-[--line-color] shadow-lg" {...root}>
	{#each items as accItem}
		<div {...$item(accItem.id)} class="accordion-item">
			<h2 class="flex">
				<button {...$trigger(accItem.id)} class="accordion-trigger">{accItem.title}</button>
			</h2>
			{#if $isSelected(accItem.id)}
				<div class="accordion-content" {...$content(accItem.id)} transition:slide|local>
					<div class="px-5 py-4">{accItem.content}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.comp-preview {
		--line-color: theme('colors.gray.300');
	}

	.accordion-item {
		@apply mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b 
				focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-magnum-400;
	}

	.accordion-trigger {
		@apply flex h-12 flex-1  cursor-pointer items-center
				justify-between bg-white px-5 text-base font-medium leading-none text-magnum-700 shadow-[0_1px_0]
				shadow-[--line-color] outline-none hover:bg-gray-200;
	}

	.accordion-content {
		@apply overflow-hidden bg-gray-100 text-sm text-gray-900;
	}
</style>
