<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeViewBuilder } from '$lib/index.js';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';
	import { generateId } from '$lib/internal/helpers';

	const {
		elements: { tree, label, item, group },
		states: { collapsedItems, focusedItem, selectedItem },
	} = createTreeViewBuilder({ forceVisible: true });

	setContext('tree', {
		item,
		group,
		collapsedItems,
		selectedItem,
	});

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

	/**
	 * Recursively add a random ID to each tree item.
	 * This is needed so that each item can be identified and have
	 * their open state remembered, so that if the item is
	 * open or closed it will remain so, even if the parent it belogns
	 * to is closed and opened again.
	 * @param tree
	 */
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

<div
	class="flex h-[300px] flex-col gap-1 overflow-auto rounded-lg bg-white px-8 py-1 text-neutral-900 md:h-[350px]"
>
	<div class="w-[240px]">
		<div>
			<span>Focused value:</span>
			<span class="text-magnum-500">
				{$focusedItem?.getAttribute('data-value')}
			</span>
		</div>

		<div>
			<span>Selected value:</span>
			<span class="text-magnum-500">
				{$selectedItem?.getAttribute('data-value')}
			</span>
		</div>
	</div>

	<hr class="border-1 border-neutral-800/70" />

	<h3 {...$label} class="text-lg font-bold">Project Structure</h3>

	<ul {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
