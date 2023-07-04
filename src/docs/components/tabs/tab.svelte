<script lang="ts">
	import { getTabsContext } from '$docs/components/tabs/root.svelte';
	import { createTooltip } from '@melt-ui/svelte';
	import { Npm, Yarn, Pnpm } from '../icons';
	import { fade, slide } from 'svelte/transition';

	export let tab: string;

	const {
		content,
		trigger: toolTrigger,
		arrow,
		open,
	} = createTooltip({
		positioning: {
			placement: tab === 'npm' ? 'left' : tab === 'yarn' ? 'top' : 'right',
		},
		openDelay: 200,
		closeDelay: 100,
	});

	const { trigger } = getTabsContext();
</script>

<button
	{...$trigger(tab)}
	{...$toolTrigger}
	use:toolTrigger.action
	use:trigger.action
	class="rounded-md border border-transparent bg-neutral-800 px-3 py-2 text-neutral-400 transition
        hover:opacity-100 focus:!border-magnum-400 focus:!text-magnum-400
        data-[state=active]:border-magnum-700 data-[state=active]:py-2 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
>
	{#if tab === 'npm'}
		<div class="px-2">
			<Npm class="h-4 w-4" />
		</div>
	{:else if tab === 'yarn'}
		<div class="px-2">
			<Yarn class="h-4 w-4" />
		</div>
	{:else if tab === 'pnpm'}
		<div class="px-2">
			<Pnpm class="h-4 w-4" />
		</div>
	{/if}
</button>
{#if $open}
	<div
		{...$content}
		use:content.action
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-md bg-magnum-700 shadow-sm"
	>
		<p class="px-4 py-1 font-mono text-sm text-white">{tab}</p>
		<div {...$arrow} />
	</div>
{/if}
