<script lang="ts">
	import { onMount } from 'svelte';
	import Tree from './tree.svelte';
	import type { TableOfContents, TableOfContentsItem } from '.';

	import { createTableOfContents } from '@melt-ui/svelte';

	const test_toc = createTableOfContents({
		selector: '#mdsvex',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		tocType: 'lowest-parents',
	});

	let filteredHeadingsList: TableOfContents;

	function getHeadingsWithHierarchy() {
		const headings: HTMLHeadingElement[] = Array.from(document.querySelectorAll('[data-toc]'));
		const hierarchy: TableOfContents = { items: [] };
		let currentLevel: TableOfContentsItem | undefined = undefined;

		headings.forEach((heading: HTMLHeadingElement) => {
			const level = parseInt(heading.tagName.charAt(1));
			if (!heading.id) {
				let newId = heading.innerText
					.replaceAll(/[^a-zA-Z0-9 ]/g, '')
					.replaceAll(' ', '-')
					.toLowerCase();
				heading.id = `${newId}`;
			}

			const item: TableOfContentsItem = {
				title: heading.textContent || '',
				url: `#${heading.id}`,
				items: [],
			};

			if (level === 2) {
				hierarchy.items.push(item);
				currentLevel = item;
			} else if (level === 3 && currentLevel?.items) {
				currentLevel.items.push(item);
			}
		});

		filteredHeadingsList = hierarchy;
	}

	// Lifecycle
	onMount(() => {
		getHeadingsWithHierarchy();
	});

	$: if ($test_toc.headings) console.log($test_toc.headings);
</script>

<div>
	{#each $test_toc.headings as { heading, active }}
		<div style={active ? 'color: orange' : ''}>
			<!-- {active ? 'active: ' : ''} {heading.innerText} -->
			{active ? 'active: ' : ''}
			{heading}
		</div>
	{/each}
</div>

<div class="space-y-2">
	<p class="font-medium">On This Page</p>
	<Tree tree={filteredHeadingsList} />
</div>
