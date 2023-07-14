<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import type { ChangeFn } from '@melt-ui/svelte/internal/helpers';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

    const customValue = writable('item-1')

    const onValueChange: ChangeFn<string[]> = ({ prev, next }) => {
        console.log('prev', prev)
        console.log('next', next)
        return next
    }

	const { content, item, trigger, isSelected, root } = createAccordion({
        value: customValue,
        defaultValue: 'item-2',
        type: "single",
        onValueChange,
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

    $: console.log($customValue)
</script>

<div class="mx-auto w-full max-w-md rounded-md shadow-lg" {...$root}>
	{#each items as { id, title, description }, i}
		<div
			{...$item(id)}
			class="overflow-hidden transition-colors first:rounded-t
            last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring
            focus-within:ring-magnum-400"
		>
			<h2 class="flex">
				<button
					id={i === 0 ? 'accordion-trigger' : undefined}
					{...$trigger(id)}
					use:trigger
					class="flex h-12 flex-1 cursor-pointer items-center text-magnum-700 justify-between bg-white
                 px-5 text-base font-medium leading-none
                 transition-colors hover:bg-opacity-95 focus:!ring-0 border-b border-b-magnum-700
								 {i === items.length - 1 ? 'border-b-0' : ''}"
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="overflow-hidden bg-neutral-100 text-sm text-neutral-900"
					{...$content(id)}
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
