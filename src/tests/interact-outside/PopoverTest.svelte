<script lang="ts">
	import { createPopover, melt, type CreatePopoverProps } from '$lib/index.js';

	type $$Props = CreatePopoverProps;

	const {
		elements: { trigger, content },
		states: { open },
	} = createPopover({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<button use:melt={$trigger} data-testid="popover-trigger">trigger</button>
{#if $open}
	<div use:melt={$content} data-testid="popover-content" />
{/if}
