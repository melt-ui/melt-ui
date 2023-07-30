<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getTabsContext } from './root.svelte';
	import Tab from './tab.svelte';

	const { list, tabs } = getTabsContext();
</script>

<div class="flex items-center gap-3" use:melt={$list}>
	{#each $tabs as tab}
		<Tab {tab} />
	{/each}
</div>
