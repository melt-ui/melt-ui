<!-- https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ -->

<script lang="ts">
	import { setContext } from 'svelte';
	import { createTreeViewBuilder } from '@melt-ui/svelte';

	import Tree from './tree.svelte';
	import type { TreeItem } from './tree.svelte';

	const { tree, label, item, group, currentFocusedItem } =
		createTreeViewBuilder({ id: '' });

	setContext('tree-item', item);
	setContext('tree-group', group);

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
</script>

<div class="flex flex-col gap-2">
	<div class="block">
		{$currentFocusedItem?.getAttribute('data-value')}
	</div>
	<h3 {...$label} class="text-lg font-semibold">Project Structure</h3>

	<ul {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
