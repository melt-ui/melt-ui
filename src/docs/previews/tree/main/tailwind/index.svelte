<script lang="ts">
	import { createTreeView } from '$lib/index.js';
	import { setContext } from 'svelte';

	import type { TreeItem } from './tree.svelte';
	import Tree from './tree.svelte';

	const ctx = createTreeView({ forceVisible: true });
	setContext('tree', ctx);

	const {
		elements: { tree },
	} = ctx;

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
	class="h-[18.75rem] w-[18.75rem] rounded-xl bg-white text-neutral-900 md:h-[350px]"
>
	<div class="flex flex-col gap-1 px-4 pt-4">
		<h3 class="text-lg font-bold">Project Structure</h3>
		<hr />
	</div>

	<ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>
