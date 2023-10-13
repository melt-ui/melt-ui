<script lang="ts">
	import { getTabsContext } from '$docs/components/tabs/root.svelte';
	import { Npm, Yarn, Pnpm } from '$docs/components/icons/index.js';
	import { melt } from '$lib/index.js';

	export let tab: string;

	const { trigger } = getTabsContext();
</script>

<button
	use:melt={$trigger(tab)}
	class="border border-neutral-700/50 bg-neutral-700/30 px-3 py-2 text-neutral-400 transition
        first-of-type:rounded-tl-lg hover:opacity-100 focus-visible:!border-magnum-400 focus-visible:!text-magnum-400 focus-visible:!ring-0
        data-[state=active]:bg-[#1E1E1E] data-[state=active]:py-2 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
>
	<div class="flex items-center gap-2 px-1">
		<span class="font-mono text-xs font-semibold">{tab}</span>
	</div>
</button>
