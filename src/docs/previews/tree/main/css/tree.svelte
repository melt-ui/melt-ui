<script context="module" lang="ts">
	import { ArrowLeft, Folder, FolderOpen } from 'lucide-svelte';
	import JS from './icons/JS.svelte';
	import Svelte from './icons/Svelte.svelte';

	type Icon = 'svelte' | 'folder' | 'js';

	export type TreeItem = {
		title: string;
		icon: Icon;

		children?: TreeItem[];
	};

	export const icons = {
		svelte: Svelte,
		folder: Folder,
		folderOpen: FolderOpen,
		js: JS,
		highlight: ArrowLeft,
	};
</script>

<script lang="ts">
	import { melt, type TreeView } from '$lib/index.js';
	import { getContext } from 'svelte';

	export let treeItems: TreeItem[];
	export let level = 1;

	const {
		elements: { item, group },
		helpers: { isExpanded, isSelected },
	} = getContext<TreeView>('tree');
</script>

{#each treeItems as { title, icon, children }, i}
	{@const itemId = `${title}-${i}`}
	{@const hasChildren = !!children?.length}

	<li class={level !== 1 ? 'itemContainer' : ''}>
		<button
			class="item"
			use:melt={$item({
				id: itemId,
				hasChildren,
			})}
		>
			<!-- Add icon. -->
			{#if icon === 'folder' && hasChildren && $isExpanded(itemId)}
				<svelte:component this={icons['folderOpen']} class="square-4" />
			{:else}
				<svelte:component this={icons[icon]} class="square-4" />
			{/if}

			<span class="select-none">{title}</span>

			<!-- Selected icon. -->
			{#if $isSelected(itemId)}
				<svelte:component this={icons['highlight']} class="square-4" />
			{/if}
		</button>

		{#if children}
			<ul use:melt={$group({ id: itemId })}>
				<svelte:self treeItems={children} level={level + 1} />
			</ul>
		{/if}
	</li>
{/each}

<style>
	:root {
		--magnum-200: #fce0ac;
	}

	* {
		all: unset;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* Remove docs' focus box-shadow styling. */
	li:focus {
		box-shadow: none !important;
	}

	.itemContainer {
		padding-left: 1rem;
	}

	.select-none {
		user-select: none;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 0.375rem;
	}
	.item:focus {
		background-color: var(--magnum-200);
	}

	ul,
	li {
		display: block;
	}
</style>
