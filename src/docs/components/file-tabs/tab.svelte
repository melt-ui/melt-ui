<script lang="ts">
	import { getTabsContext } from '$docs/components/tabs/root.svelte';
	import { melt } from '$lib/index.js';

	export let tab: string;

	const { trigger } = getTabsContext();
</script>

<button
	use:melt={$trigger(tab)}
	class="border-neutral-700/50 bg-neutral-600 px-3 py-2 text-neutral-300 opacity-90 transition
        even:border-l first-of-type:rounded-tl-md last-of-type:border-r hover:opacity-100 focus-visible:!border-magnum-400 focus-visible:!text-magnum-400
        focus-visible:!ring-0 data-[state=active]:bg-neutral-800 data-[state=active]:py-2 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100 data-[state=inactive]:hover:bg-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-400 dark:data-[state=active]:bg-[#1E1E1E]"
>
	<div class="flex items-center gap-2 px-1">
		<span class="font-mono text-xs font-semibold">{tab}</span>
	</div>
</button>
