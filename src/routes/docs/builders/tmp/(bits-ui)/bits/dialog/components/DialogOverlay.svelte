<script lang="ts">
	import { melt } from '$lib';
	import { ctx } from '../ctx.js';
	import type { OverlayProps } from '../types.js';

	type $$Props = OverlayProps;
	export let asChild = false;
	const {
		elements: { overlay },
		states: { open },
	} = ctx.get();
</script>

{#if $open}
	{#if asChild}
		<slot builder={$overlay} />
	{:else}
		<div use:melt={$overlay} {...$$restProps} />
	{/if}
{/if}
