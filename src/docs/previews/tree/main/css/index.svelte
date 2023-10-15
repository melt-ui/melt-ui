<script lang="ts">
	import { createTreeView } from '$lib/index.js';
	import { setContext } from 'svelte';

	import type { TreeItem } from './tree.svelte';
	import Tree from './tree.svelte';

	const ctx = createTreeView({
		defaultExpanded: ['lib-0', 'tree-0'],
	});
	setContext('tree', ctx);

	const {
		elements: { tree },
	} = ctx;

	const treeItems: TreeItem[] = [
		{ title: 'index.svelte', icon: 'svelte' },
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
					title: 'icons',
					icon: 'folder',
					children: [
						{ title: 'JS.svelte', icon: 'svelte' },
						{ title: 'Svelte.svelte', icon: 'svelte' },
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

<div class="container">
	<div class="main">
		<h3 class="main-title">Project Structure</h3>
		<hr />
	</div>

	<ul class="tree" {...$tree}>
		<Tree {treeItems} />
	</ul>
</div>

<style>
	* {
		all: unset;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:root {
		--neutral-900: rgb(23, 23, 23, 1);
	}

	hr {
		height: 1px;
		background-color: #e5e7eb;
		border-top-width: 1px;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem 1rem 0rem 1rem;
	}

	.main-title {
		font-weight: 700;
		font-size: 1.125rem;
		line-height: 1.75rem;
	}

	.container {
		display: flex;
		flex-direction: column;
		width: 18.75rem;
		height: 18.75rem;
		background-color: white;
		color: var(--neutral-900);
		border-radius: 0.75rem;
	}

	.tree {
		overflow: auto;
		padding: 0.5rem 1rem 1rem 1rem;
	}

	@media (min-width: 768px) {
		.container {
			height: 350px;
		}
	}
</style>
