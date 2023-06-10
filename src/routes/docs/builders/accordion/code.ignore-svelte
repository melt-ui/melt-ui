<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();
</script>

<div class="w-full rounded-md bg-[--line-color] shadow-lg" {...root}>
	<div {...$item('item-1')} class="accordion-item">
		<h3 class="flex">
			<button {...$trigger('item-1')} class="accordion-trigger">Is it accessible?</button>
		</h3>
		{#if $isSelected('item-1')}
			<div class="accordion-content" {...$content('item-1')} transition:slide|local>
				<div class="px-5 py-4">Yes. It adheres to the WAI-ARIA design pattern.</div>
			</div>
		{/if}
	</div>

	<div class="accordion-item" {...$item('item-2')}>
		<h3 class="flex">
			<button class="accordion-trigger" {...$trigger('item-2')}>Is it unstyled?</button>
		</h3>
		{#if $isSelected('item-2')}
			<div class="accordion-content" {...$content('item-2')} transition:slide|local>
				<div class="px-5 py-4">
					Yes. It's unstyled by default, giving you freedom over the look and feel.
				</div>
			</div>
		{/if}
	</div>

	<div class="accordion-item" {...$item('item-3')}>
		<h3 class="flex">
			<button class="accordion-trigger" {...$trigger('item-3')}>Can it be animated?</button>
		</h3>
		{#if $isSelected('item-3')}
			<div class="accordion-content" {...$content('item-3')} transition:slide|local>
				<div class="px-5 py-4">
					Yes! You can use the transition prop to configure the animation.
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.comp-preview {
		--line-color: theme('colors.gray.300');
	}

	.accordion-item {
		@apply mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b 
				focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-black;
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
