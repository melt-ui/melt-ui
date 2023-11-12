<script lang="ts">
	import Tooltip from '$docs/components/tooltip.svelte';
	import { flyAndScale } from '$docs/utils';
	import { createPopover, melt } from '$lib';
	import { theme } from '.';
	import Options from './options.svelte';
	import ThemeIcon from './theme-icon.svelte';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createPopover({
		positioning: { placement: 'bottom', gutter: 10 },
		forceVisible: true,
	});
</script>

<Tooltip text="Switch theme">
	<button
		class="text-neutral-400 transition-colors hover:text-neutral-50"
		aria-label="Open theme switcher"
		use:melt={$trigger}
	>
		<ThemeIcon theme={$theme} />
		<span class="sr-only">Open popover</span>
	</button>
</Tooltip>

{#if $open}
	<div
		use:melt={$content}
		class="z-50 w-32 rounded-md bg-neutral-700 px-2 py-2 shadow-sm shadow-neutral-800"
		transition:flyAndScale={{
			duration: 150,
			y: 0,
			start: 0.96,
		}}
	>
		<div use:melt={$arrow} />
		<Options onChange={() => ($open = false)} />
	</div>
{/if}
