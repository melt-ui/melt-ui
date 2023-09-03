<script lang="ts">
	import {
		type TableOfContentsItem,
		type CreateTableOfContentsReturn,
		melt,
	} from '$lib';

	export let tree: TableOfContentsItem[] = [];
	export let activeHeadingIdxs: number[];
	export let item: CreateTableOfContentsReturn['item'];
	export let level = 1;
</script>

<ul class="m-0 list-none {level !== 1 ? 'pl-4' : ''}">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			<li class="mt-0 pt-2">
				<a
					href="#{heading.id}"
					use:melt={$item(heading.id)}
					class="inline-flex items-center justify-center gap-1 text-neutral-500 no-underline transition-colors
					 hover:!text-magnum-600 data-[active]:text-magnum-700"
				>
					<!--
						The original heading node is also passed down,
						so you can display headings however you want.
					-->
					{#if heading.node.children?.length > 0}
						{@html heading.node.children[0].outerHTML}
					{/if}
					{heading.title}
				</a>
				{#if heading.children && heading.children.length}
					<svelte:self
						tree={heading.children}
						level={level + 1}
						{activeHeadingIdxs}
						{item}
					/>
				{/if}
			</li>
		{/each}
	{/if}
</ul>
