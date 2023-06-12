<script lang="ts">
	import { createTabs } from '$lib';

	export let tabs: string[] = [];

	const { root, content, list, trigger } = createTabs({
		value: tabs[0],
	});
</script>

<div {...root} class="mt-2">
	<div class="flex gap-2" {...list}>
		{#each tabs as tab}
			<button
				{...$trigger(tab)}
				class="rounded-md border border-transparent bg-neutral-800 px-3 py-1 text-neutral-500 opacity-75 outline-none transition
        hover:opacity-100 focus:ring focus:ring-magnum-700
        data-[state=active]:border-magnum-700 data-[state=active]:text-magnum-500 data-[state=active]:opacity-100"
			>
				{tab}
			</button>
		{/each}
	</div>
	{#each tabs as tab}
		<div {...$content(tab)} class="outline-none">
			<slot {tab} />
		</div>
	{/each}
</div>
