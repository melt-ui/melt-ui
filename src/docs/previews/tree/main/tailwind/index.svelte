<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeViewBuilder } from '$lib';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';
	import { generateId } from '$lib/internal/helpers';

	const {
		elements: { tree, label, item, group },
		helpers: { focusedItem, selectedItem },
		states: { collapsedItems },
	} = createTreeViewBuilder({ collapse: false, forceVisible: true });

	setContext('tree-item', item);
	setContext('tree-group', group);
	setContext('collapsed-items', collapsedItems);
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

<div
	class="flex h-[300px] flex-col gap-1 overflow-auto rounded-lg bg-white px-8 py-1 text-neutral-900 md:h-[350px]"
>
	<div class="w-[225px]">
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
