<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	import { melt } from '$lib/index.js';
	import { getTabsContext } from './root.svelte';
	import Tab from './tab.svelte';

	const { list, tabs } = getTabsContext();

	let className = '';
	export { className as class };
</script>

<div class={cn('flex w-full items-center   bg-neutral-700/30', className)} use:melt={$list}>
	{#each $tabs as tab}
		<Tab {tab} />
	{/each}
</div>
