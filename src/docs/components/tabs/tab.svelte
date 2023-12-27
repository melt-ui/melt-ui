<script lang="ts">
	import { getTabsContext } from '$docs/components/tabs/root.svelte';
	import { Npm, Yarn, Pnpm } from '$docs/components/icons/index.js';
	import { melt } from '$lib/index.js';

	export let tab: string;

	const { trigger } = getTabsContext();
</script>

<button
	use:melt={$trigger(tab)}
	class="rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-neutral-400 transition
        hover:opacity-100 focus-visible:!border-magnum-400 focus-visible:!text-magnum-400 focus-visible:!ring-0
        data-[state=active]:border-magnum-700 data-[state=active]:py-2 data-[state=active]:text-magnum-500 data-[state=active]:opacity-100 dark:data-[state=active]:text-magnum-600"
>
	<div class="flex items-center gap-2 px-1">
		{#if tab === 'npm'}
			<Npm class="square-4" />
		{:else if tab === 'yarn'}
			<Yarn class="square-4" />
		{:else if tab === 'pnpm'}
			<Pnpm class="square-4" />
		{/if}
		<span class="font-mono text-sm font-semibold">{tab}</span>
	</div>
</button>
