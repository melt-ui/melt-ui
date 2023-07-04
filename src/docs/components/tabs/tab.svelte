<script lang="ts">
	import { getTabsContext } from '$docs/components/tabs/root.svelte';
	import { Npm, Yarn, Pnpm } from '$docs/components/icons';

	export let tab: string;

	const { trigger } = getTabsContext();
</script>

<button
	{...$trigger(tab)}
	use:trigger.action
	class="rounded-md border border-transparent bg-neutral-800 px-3 py-2 text-neutral-400 transition
        hover:opacity-100 focus:!border-magnum-400 focus:!text-magnum-400
        data-[state=active]:border-magnum-700 data-[state=active]:py-2 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
>
	<div class="flex items-center gap-2 px-1">
		{#if tab === 'npm'}
			<Npm class="h-4 w-4" />
		{:else if tab === 'yarn'}
			<Yarn class="h-4 w-4" />
		{:else if tab === 'pnpm'}
			<Pnpm class="h-4 w-4" />
		{/if}
		<span class="font-mono text-sm font-semibold">{tab}</span>
	</div>
</button>
