<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { SeparatorProps } from '../types.js';

	type $$Props = SeparatorProps;
	export let asChild = false;
	const separator = ctx.getMenu().elements.separator;
</script>

{#if asChild}
	<slot builder={$separator} />
{:else}
	<div use:melt={$separator} {...$$restProps} />
{/if}
