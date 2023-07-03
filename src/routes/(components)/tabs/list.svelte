<script lang="ts">
	import { getTabsContext } from './root.svelte';

	const { list, trigger, tabs } = getTabsContext();
</script>

<div class="flex items-center gap-2" {...list}>
	{#each $tabs as tab}
		<button
			{...$trigger(tab)}
			use:trigger
			class="rounded-md border border-transparent bg-neutral-800 px-3 py-1 text-neutral-500 opacity-75 transition
        hover:opacity-100 focus:!border-magnum-400 focus:!text-magnum-400
        data-[state=active]:border-magnum-700 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
		>
			{tab}
		</button>
	{/each}
</div>
