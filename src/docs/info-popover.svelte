<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	import { createPopover, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { Info } from 'lucide-svelte';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createPopover();

	export let iconClasses = '';
	export let contentClasses = '';
</script>

<button use:melt={$trigger} aria-label="More info">
	<Info class={cn('text-white square-4', iconClasses)} />
	<span class="sr-only">Open popover</span>
</button>
{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class={cn(
			'mdsvex z-30 max-w-[300px] rounded-md bg-zinc-800 px-4 py-3 shadow-sm shadow-neutral-800',
			contentClasses
		)}
	>
		<div use:melt={$arrow} />
		<p class="text-sm leading-5 text-white">
			<slot />
		</p>
	</div>
{/if}

<style lang="postcss">
	div {
		@apply focus:ring-0 !important;
	}
</style>
