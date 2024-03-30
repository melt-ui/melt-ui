<script lang="ts">
	import { createTooltip, melt, type CreateTooltipProps } from '$lib/index.js';

	type $$Props = CreateTooltipProps;

	const {
		elements: { trigger, content },
		states: { open },
	} = createTooltip({ ...$$restProps, forceVisible: true, openDelay: 0, closeDelay: 0 });
</script>

<button use:melt={$trigger} data-testid="tooltip-trigger">trigger</button>
{#if $open}
	<div use:melt={$content} data-testid="tooltip-content" />
{/if}
