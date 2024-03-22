<script lang="ts">
	import { createTooltip, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createTooltip({
		forceVisible: true,
		openDelay: 500,
		positioning: {
			strategy: 'fixed',
		},
	});

	export let text = 'Tooltip text';
</script>

<div use:melt={$trigger}>
	<slot />
</div>

{#if $open}
	<div
		use:melt={$content}
		in:fade={{ duration: 150 }}
		class="z-50 rounded-md bg-neutral-700 px-2 py-1 text-sm text-neutral-50 shadow-sm"
	>
		<div use:melt={$arrow} />
		{text}
	</div>
{/if}

<style lang="postcss">
	[data-melt-tooltip-trigger] {
		display: grid;
		place-items: center;
	}
</style>
