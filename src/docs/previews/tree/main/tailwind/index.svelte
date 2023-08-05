<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeViewBuilder } from '$lib';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';
	import { generateId } from '$lib/internal/helpers';

	const {
		tree,
		label,
		item,
		group,
		focusedItem,
		selectedItem,
		itemsWithHiddenChildren,
	} = createTreeViewBuilder({ collapse: false });

	setContext('tree-item', item);
	setContext('tree-group', group);
	setContext('hidden-children', itemsWithHiddenChildren);
	setContext('selected', selectedItem);

	const treeItems: TreeItem[] = [
		{
			title: 'lib',
			icon: 'folder',
			children: [
				{
					title: 'tree',
					icon: 'folder',
					children: [
						{
							title: 'Tree.svelte',
							icon: 'svelte',
						},
						{
							title: 'TreeView.svelte',
							icon: 'svelte',
						},
					],
				},
				{
					title: 'index.js',
					icon: 'js',
				},
			],
		},
		{
			title: 'src',
			icon: 'folder',
			children: [
				{
					title: 'routes',
					icon: 'folder',
					children: [
						{
							title: '+layout.svelte',
							icon: 'svelte',
						},
						{
							title: '+page.svelte',
							icon: 'svelte',
						},
					],
				},
			],
		},
	];

	// Recursively add a random ID to each tree item.
	function addRandomId(tree: TreeItem[]) {
		tree.forEach((item) => {
			item.id = generateId();

			if (item.children && item.children.length > 0) {
				addRandomId(item.children);
			}
		});
	}

	addRandomId(treeItems);
</script>

<div class="flex h-[390px] flex-col gap-1 rounded-lg bg-neutral-900 px-8 py-1">
	<div class="w-64">
		<span>Focused value:</span>
		<span class="text-magnum-500">
			{$focusedItem?.getAttribute('data-value')}
		</span>
	</div>
	<div class="w-64">
		<span>Selected value:</span>
		<span class="text-magnum-500">
			{$selectedItem?.getAttribute('data-value')}
		</span>
	</div>
	<hr />
	<h3 {...$label} class="text-lg font-bold">Project Structure</h3>

	<ul {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
