<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$routes/helpers';
	import type { TableOfContents } from '.';

	export let tree: TableOfContents = {
		items: [],
	};
	export let level = 1;
</script>

<ul class={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
	{#if tree.items && tree.items.length}
		{#each tree.items as item, i (i)}
			<li class={cn('mt-0 pt-2')}>
				<a
					href={item.url}
					class={cn(
						'inline-block no-underline transition-colors hover:text-white',
						item.url === $page.url.hash ? 'font-medium text-white' : 'text-neutral-300'
					)}
				>
					{item.title}
				</a>
				{#if item.items && item.items.length}
					<svelte:self tree={item} level={level + 1} />
				{/if}
			</li>
		{/each}
	{/if}
</ul>
