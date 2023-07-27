<!-- https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ -->

<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeViewBuilder } from '@melt-ui/svelte';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';
	import { generateId } from '@melt-ui/svelte/internal/helpers';

	const {
		tree,
		label,
		item,
		group,
		currentFocusedItem,
		currentSelectedItem,
		itemsWithHiddenChildren,
	} = createTreeViewBuilder({ collapse: false });

	setContext('tree-item', item);
	setContext('tree-group', group);
	setContext('hidden-children', itemsWithHiddenChildren);
	setContext('selected', currentSelectedItem);

	const treeItems: TreeItem[] = [
		{
			title: 'lib',
			icon: 'folder',
			id: generateId(),
			children: [
				{
					title: 'tree',
					icon: 'folder',
					id: generateId(),
					children: [
						{
							title: 'Tree.svelte',
							icon: 'svelte',
							id: generateId(),
						},
						{
							title: 'TreeView.svelte',
							icon: 'svelte',
							id: generateId(),
						},
					],
				},
				{
					title: 'index.js',
					icon: 'js',
					id: generateId(),
				},
			],
		},
		{
			title: 'src',
			icon: 'folder',
			id: generateId(),
			children: [
				{
					title: 'routes',
					icon: 'folder',
					id: generateId(),
					children: [
						{
							title: '+layout.svelte',
							icon: 'svelte',
							id: generateId(),
						},
						{
							title: '+page.svelte',
							icon: 'svelte',
							id: generateId(),
						},
					],
				},
			],
		},
	];
</script>

<div class="flex h-[390px] flex-col gap-1 rounded-lg bg-neutral-900 px-8 py-1">
	<div class="w-64">
		<span>Focused value:</span>
		<span class="text-magnum-500">
			{$currentFocusedItem?.getAttribute('data-value')}
		</span>
	</div>
	<div class="w-64">
		<span>Selected value:</span>
		<span class="text-magnum-500">
			{$currentSelectedItem?.getAttribute('data-value')}
		</span>
	</div>
	<hr />
	<h3 {...$label} class="text-lg font-bold">Project Structure</h3>

	<ul {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
