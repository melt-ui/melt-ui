<script lang="ts">
	import { cn } from '$docs/utils';
	import { createPopover } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Info from '~icons/lucide/info';

	const { trigger, content, open, arrow } = createPopover();

	export let iconClasses = '';
	export let contentClasses = '';
</script>

<button {...$trigger} use:trigger aria-label="More info">
	<Info class={cn('h-4 w-4 text-white', iconClasses)} />
	<span class="sr-only">Open popover</span>
</button>
{#if $open}
	<div
		{...$content}
		use:content
		transition:fade={{ duration: 100 }}
		class={cn(
			'mdsvex z-30 max-w-[300px] rounded-md bg-zinc-800 px-4 py-3 shadow-sm shadow-neutral-800',
			contentClasses
		)}
	>
		<div {...$arrow} />
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
