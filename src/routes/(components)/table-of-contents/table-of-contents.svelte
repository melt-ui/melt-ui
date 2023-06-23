<script lang="ts">
	import { onMount } from 'svelte';
	import Tree from './tree.svelte';
	import type { TableOfContents, TableOfContentsItem } from '.';

	let filteredHeadingsList: TableOfContents;

	function getHeadingsWithHierarchy() {
		const headings: HTMLHeadingElement[] = Array.from(document.querySelectorAll('[data-toc]'));
		const hierarchy: TableOfContents = { items: [] };
		let currentLevel: TableOfContentsItem | undefined = undefined;

		headings.forEach((heading: HTMLHeadingElement) => {
			console.log('headings:', headings);
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
</script>

<div class="space-y-2">
	<p class="font-medium">On This Page</p>
	<Tree tree={filteredHeadingsList} />
</div>
