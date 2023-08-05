<script lang="ts">
	import { cn } from '$docs/utils';
	import { melt } from '$lib';
	import { getTabsContext } from './root.svelte';
	import Tab from './tab.svelte';

	const { list, tabs } = getTabsContext();

	let className = '';
	export { className as class };
</script>

<div class={cn('flex items-center gap-3', className)} use:melt={$list}>
	{#each $tabs as tab}
		<Tab {tab} />
	{/each}
</div>
