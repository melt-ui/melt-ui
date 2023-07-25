<script context="module" lang="ts">
	import Svelte from '~icons/simple-icons/svelte';
	import Folder from '~icons/lucide/folder';

	type Icon = 'svelte' | 'folder';

	export type TreeItem = {
		title: string;
		icon: Icon;
		children?: TreeItem[];
	};

	export const icons = {
		svelte: Svelte,
		folder: Folder,
	};
</script>

<script lang="ts">
	export let treeItems: TreeItem[];
	export let level = 1;
</script>

{#each treeItems as { title, icon, children }, i (i)}
	<li class={level !== 1 ? 'pl-4 pt-2' : ''}>
		<div class="flex items-center gap-1">
			<svelte:component this={icons[icon]} />
			<span>{title}</span>
		</div>
		{#if children}
			<ul>
				<svelte:self treeItems={children} level={level + 1} />
			</ul>
		{/if}
	</li>
{/each}
