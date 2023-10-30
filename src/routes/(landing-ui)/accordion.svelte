<script lang="ts">
	import { cn } from '$docs/utils';
	import { createAccordion, melt } from '$lib/index.js';
	import { slide } from 'svelte/transition';

	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion({
		defaultValue: 'item-1',
	});

	const items = [
		{
			id: 'item-1',
			title: 'What is it?',
			description:
				'A collection of accessible & unstyled component builders for Svelte applications.',
		},
		{
			id: 'item-2',
			title: 'Can I customize it?',
			description: 'Totally, it is 100% stylable and overridable.',
		},
		{
			id: 'item-3',
			title: 'Svelte is awesome, huh?',
			description: 'Yes, and so are you!',
		},
	];

	let className = '';
	export { className as class };
</script>

<div
	class={cn('mx-auto w-[18rem] max-w-full rounded-xl bg-white shadow-lg sm:w-[25rem]', className)}
	{...$root}
>
	{#each items as { id, title, description }, i}
		<div
			use:melt={$item(id)}
			class="overflow-hidden transition-colors first:rounded-t-xl
            last:rounded-b-xl"
		>
			<h2 class="flex">
				<button
					use:melt={$trigger(id)}
					class={cn(
						'flex flex-1 cursor-pointer items-center justify-between ',
						'bg-white px-5 py-5 text-base font-medium leading-none',
						'text-black transition-colors hover:bg-neutral-100 focus:!ring-0',
						'focus-visible:text-magnum-800',
						i !== 0 && 'border-t border-t-neutral-300'
					)}
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class={cn('content', 'overflow-hidden bg-neutral-100 text-sm text-neutral-600')}
					use:melt={$content(id)}
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

<style lang="postcss">
	.content {
		/*		box-shadow: inset 0px 1px 0px _Theme('colors.neutral.300');*/
	}
</style>
