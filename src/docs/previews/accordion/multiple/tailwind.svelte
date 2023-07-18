<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion({
		type: 'multiple',
	});

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description:
				"Yes. It's unstyled by default, giving you freedom over the look & feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description:
				'Yes! You can use the transition prop to configure the animation.',
		},
	];
</script>

<div class="mx-auto w-full max-w-md rounded-md shadow-lg" {...$root}>
	{#each items as { id, title, description }, i}
		<div
			melt={$item(id)}
			class="overflow-hidden transition-colors first:rounded-t
            last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring
            focus-within:ring-magnum-400"
		>
			<h2 class="flex">
				<button
					melt={$trigger(id)}
					class="flex h-12 flex-1 cursor-pointer items-center justify-between border-b border-b-magnum-700
                 bg-white px-5 text-base font-medium
                 leading-none text-magnum-700 transition-colors hover:bg-opacity-95 focus:!ring-0
								 {i === items.length - 1 ? 'border-b-0' : ''}"
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="overflow-hidden bg-neutral-100 text-sm text-neutral-900"
					melt={$content(id)}
					transition:slide
				>
					<div class="px-5 py-4">
						{description}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
