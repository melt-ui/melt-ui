<script context="module" lang="ts">
	import JS from './icons/JS.svelte';
	import Svelte from './icons/Svelte.svelte';
	import { FolderOpen, Folder, ArrowLeft } from 'lucide-svelte';

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
		highlight: ArrowLeft,
	};
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		melt,
		type TreeViewElements,
		type TreeViewHelpers,
	} from '$lib/index.js';

	export let treeItems: TreeItem[];
	export let level = 1;

	const { item, group, isCollapsedGroup, isSelected, isFocused } = getContext<{
		item: TreeViewElements['item'];
		group: TreeViewElements['group'];
		isCollapsedGroup: TreeViewHelpers['isCollapsedGroup'];
		isSelected: TreeViewHelpers['isSelected'];
		isFocused: TreeViewHelpers['isFocused'];
	}>('tree');
</script>

{#each treeItems as { title, icon, children, id }, i (i)}
	{@const itemId = `${id}`}

	<li
		use:melt={$item({
			value: title,
			id: itemId,
			hasChildren: !!children && children?.length > 0,
		})}
		class={level !== 1 ? 'pl-4' : ''}
	>
		<div
			class="flex items-center gap-1 rounded-md p-1 {$isFocused(itemId)
				? 'bg-magnum-200'
				: ''}"
		>
			<!-- Add icon. -->
			{#if icon === 'folder' && children && !$isCollapsedGroup(itemId)}
				<svelte:component this={icons['folderOpen']} class="h-4 w-4" />
			{:else}
				<svelte:component this={icons[icon]} class="h-4 w-4" />
			{/if}

			<span class="select-none">{title}</span>

			<!-- Selected icon. -->
			{#if $isSelected(itemId)}
				<svelte:component this={icons['highlight']} class="h-4 w-4" />
			{/if}
		</div>

		{#if children && !$isCollapsedGroup(itemId)}
			<ul use:melt={$group({ id: itemId })} transition:slide>
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
</style>
