<script lang="ts">
	import { getTabsContext } from './root.svelte';
	import Tab from './tab.svelte';

	const { list, tabs } = getTabsContext();
</script>

<div class="-mb-2 flex items-center gap-3" {...list}>
	{#each $tabs as tab}
		<Tab {tab} />
	{/each}
</div>
