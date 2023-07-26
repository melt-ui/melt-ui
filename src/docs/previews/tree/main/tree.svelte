<script context="module" lang="ts">
	import Svelte from '~icons/simple-icons/svelte';
	import Folder from '~icons/lucide/folder';
	import JS from '~icons/simple-icons/javascript';

	type Icon = 'svelte' | 'folder' | 'js';

	export type TreeItem = {
		title: string;
		icon: Icon;
		children?: TreeItem[];
	};

	export const icons = {
		svelte: Svelte,
		folder: Folder,
		js: JS,
	};
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { CreateTreeViewReturn } from '@melt-ui/svelte';

	export let treeItems: TreeItem[];
	export let level = 1;

	export const item: CreateTreeViewReturn['item'] = getContext('tree-item');
	export const group: CreateTreeViewReturn['group'] = getContext('tree-group');
</script>

{#each treeItems as { title, icon, children }, i (i)}
	<li {...$item({ value: title })} use:item class={level !== 1 ? 'pl-4' : ''}>
		<div class="flex items-center gap-1 p-1">
			<svelte:component this={icons[icon]} class="h-4 w-4" />
			<span>{title}</span>
		</div>
		{#if children}
			<ul {...$group}>
				<svelte:self treeItems={children} level={level + 1} />
			</ul>
		{/if}
	</li>
{/each}

<style>
	li:focus > div {
		@apply bg-magnum-500/40;
	}
</style>
