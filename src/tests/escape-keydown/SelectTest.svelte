<script lang="ts">
	import { createSelect, melt, type CreateSelectProps } from '$lib/index.js';

	type $$Props = CreateSelectProps;

	const {
		elements: { trigger, menu },
		states: { open },
	} = createSelect({ ...$$restProps, forceVisible: true });
</script>

<button use:melt={$trigger} data-testid="select-trigger">trigger</button>
{#if $open}
	<div use:melt={$menu} data-testid="select-content" />
{/if}
