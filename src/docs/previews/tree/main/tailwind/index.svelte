<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeView } from '$lib/index.js';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';
	import { generateId } from '$lib/internal/helpers';

	const {
		elements: { tree, label, item, group },
		states: { collapsedGroups, selectedItem },
		helpers: { isCollapsedGroup, isSelected, isFocused },
	} = createTreeView({ forceVisible: true });

	setContext('tree', {
		item,
		group,
		collapsedGroups,
		selectedItem,
		isCollapsedGroup,
		isSelected,
		isFocused,
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
			title: 'routes',
			icon: 'folder',
			children: [
				{
					title: 'contents',
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
</script>

<div
	class="flex h-[18.75rem] w-[18.75rem] flex-col gap-1 overflow-auto rounded-xl bg-white p-4 text-neutral-900 md:h-[350px]"
>
	<h3 {...$label} class="text-lg font-bold">Project Structure</h3>
	<hr />

	<ul {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
