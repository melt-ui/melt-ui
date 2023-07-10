<script lang="ts">
	import { cn } from '$docs/utils';
	import { createTooltip } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Info from '~icons/lucide/info';

	const { trigger, content, open, arrow } = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 400,
		closeDelay: 250,
	});

	export let infoClasses = '';
</script>

<button {...$trigger} use:trigger aria-label="More info">
	<Info class={cn('h-4 w-4 text-white', infoClasses)} />
	<span class="sr-only">Open tooltip</span>
</button>
{#if $open}
	<div
		{...$content}
		use:content
		transition:fade={{ duration: 100 }}
		class="z-30 w-full max-w-[265px] rounded-md bg-zinc-800 px-4 py-3 shadow-sm shadow-neutral-800"
	>
		<div {...$arrow} />
		<p class="text-sm leading-5 text-white">
			<slot />
		</p>
	</div>
{/if}
