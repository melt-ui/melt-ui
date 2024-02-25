<script lang="ts">
	import { browser } from '$app/environment';
	import { createTooltip, melt } from '$lib/index.js';

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

<div
	use:melt={$content}
	class="z-50 rounded-md bg-neutral-700 px-2 py-1 text-sm text-neutral-50 shadow-sm"
	data-open={$open ? '' : undefined}
	class:hidden={!browser}
>
	<div use:melt={$arrow} />
	{text}
</div>

<style lang="postcss">
	[data-melt-tooltip-trigger] {
		display: grid;
		place-items: center;
	}

	[data-melt-tooltip-content] {
		opacity: 0;
		visibility: hidden;
		transition: 150ms ease;

		&[data-open] {
			opacity: 1;
			visibility: visible;
		}
	}
</style>
