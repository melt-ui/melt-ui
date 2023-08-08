<script lang="ts">
	import type { TableOfContentsItem, CreateTableOfContentsReturn } from '$lib';

	export let tree: TableOfContentsItem[] = [];
	export let activeHeadingIdxs: number[];
	export let item: CreateTableOfContentsReturn['item'];
	export let level = 1;
</script>

<ul class="m-0 list-none {level !== 1 ? 'pl-4' : ''}">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			{@const active = activeHeadingIdxs.includes(heading.index)}
			<li class="mt-0 pt-2">
				<a
					href="#{heading.id}"
					{...$item(heading.id)}
					use:item
					class="inline-block no-underline transition-colors hover:text-magnum-400 {active
						? 'text-neutral-100'
						: 'text-neutral-400'}"
				>
					{heading.title}
				</a>
				{#if heading.children && heading.children.length}
					<svelte:self tree={heading.children} level={level + 1} {activeHeadingIdxs} {item} />
				{/if}
			</li>
		{/each}
	{/if}
</ul>
