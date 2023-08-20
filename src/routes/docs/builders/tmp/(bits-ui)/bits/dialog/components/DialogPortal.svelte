<script lang="ts">
	import { melt } from '$lib';
	import { ctx } from '../ctx.js';
	import type { PortalProps } from '../types.js';

	type $$Props = PortalProps;
	const {
		elements: { portalled },
		states: { open },
	} = ctx.get();
</script>

<div use:melt={$portalled} {...$$restProps}>
	{#if $open}
		<slot />
	{/if}
</div>
