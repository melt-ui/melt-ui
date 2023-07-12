<script lang="ts">
	import { cn } from '$docs/utils';
	import type { TableOfContentsItem } from '@melt-ui/svelte';

	export let tree: TableOfContentsItem[] = [];
	export let activeHeadingIdxs: number[];
	export let level = 1;
</script>

<ul class={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
	{#if tree && tree.length}
		{#each tree as item, i (i)}
			{@const active = activeHeadingIdxs.includes(item.index)}
			<li class={cn('mt-0 pt-2')}>
				<a
					href="#{item.id}"
					class={cn(
						'inline-block no-underline transition-colors hover:text-white',
						active ? 'font-medium text-white' : 'text-neutral-300'
					)}
				>
					{item.title}
				</a>
				{#if item.items && item.items.length}
					<svelte:self tree={item.items} level={level + 1} {activeHeadingIdxs} />
				{/if}
			</li>
		{/each}
	{/if}
</ul>
