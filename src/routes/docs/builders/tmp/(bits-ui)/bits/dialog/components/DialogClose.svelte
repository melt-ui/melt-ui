<script lang="ts">
	import { melt } from '$lib';
	import { ctx } from '../ctx.js';
	import type { CloseEvents, CloseProps } from '../types.js';

	type $$Props = CloseProps;
	type $$Events = CloseEvents;
	export let asChild = false;
	const close = ctx.get().elements.close;
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} {...$$restProps} on:m-click on:m-keydown>
		<slot {builder} />
	</button>
{/if}
