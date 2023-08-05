<script context="module" lang="ts">
	import Svelte from '~icons/simple-icons/svelte';
	import Folder from '~icons/lucide/folder';
	import FolderOpen from '~icons/lucide/folder-open';
	import JS from '~icons/simple-icons/javascript';
	import Highlight from '~icons/lucide/arrow-left';

	type Icon = 'svelte' | 'folder' | 'js';

	export type TreeItem = {
		title: string;
		icon: Icon;
		id?: string;
		children?: TreeItem[];
	};

	export const icons = {
		svelte: Svelte,
		folder: Folder,
		folderOpen: FolderOpen,
		js: JS,
		highlight: Highlight,
	};
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { CreateTreeViewReturn } from '$lib';

	export let treeItems: TreeItem[];
	export let level = 1;

	const item: CreateTreeViewReturn['item'] = getContext('tree-item');
	const group: CreateTreeViewReturn['group'] = getContext('tree-group');
	const itemsWithHiddenChildren: CreateTreeViewReturn['itemsWithHiddenChildren'] =
		getContext('hidden-children');
	const selectedItem: CreateTreeViewReturn['selectedItem'] =
		getContext('selected');
</script>

{#each treeItems as { title, icon, children, id }, i (i)}
	{@const itemId = `${id}`}
	{@const childrenAreHidden = $itemsWithHiddenChildren.includes(itemId)}
	{@const isSelected = $selectedItem?.getAttribute('data-id') === itemId}

	<li
		{...$item({
			value: title,
			id: itemId,
			hasChildren: children !== undefined && children.length > 0,
		})}
		use:item
		class={level !== 1 ? 'pl-4' : ''}
	>
		<div class="flex items-center gap-1 rounded-md p-1">
			<!-- Add icon. -->
			{#if icon === 'folder' && children && !childrenAreHidden}
				<svelte:component this={icons['folderOpen']} class="h-4 w-4" />
			{:else}
				<svelte:component this={icons[icon]} class="h-4 w-4" />
			{/if}

			<span class="select-none">{title}</span>

			<!-- Selected icon. -->
			{#if isSelected}
				<svelte:component this={icons['highlight']} />
			{/if}
		</div>

		{#if children && !childrenAreHidden}
			<ul {...$group({ id: itemId })} use:group transition:slide>
				<svelte:self treeItems={children} level={level + 1} />
			</ul>
		{/if}
	</li>
{/each}

<style>
	/* Remove docs' focus box-shadow styling. */
	li:focus {
		box-shadow: none !important;
	}
	li:focus > div {
		@apply bg-magnum-600/25;
	}
</style>
