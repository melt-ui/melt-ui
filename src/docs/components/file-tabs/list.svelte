<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	import { melt } from '$lib/index.js';
	import { getTabsContext } from './root.svelte';
	import Tab from './tab.svelte';

	const { list, tabs } = getTabsContext();

	let className = '';
	export { className as class };
</script>

<div
	class={cn(
		'flex w-full items-center rounded-b-none rounded-tl-lg rounded-tr-lg border-x border-t border-neutral-700/50 border-b-transparent bg-neutral-700 dark:bg-neutral-700/30',
		className
	)}
	use:melt={$list}
>
	{#each $tabs as tab}
		<Tab {tab} />
	{/each}
</div>
