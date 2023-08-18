<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { SubContentEvents, SubContentProps } from '../types.js';

	type $$Props = SubContentProps;
	type $$Events = SubContentEvents;
	export let asChild = false;
	const subMenu = ctx.getSub().elements.subMenu;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$subMenu} />
{:else}
	<div use:melt={$subMenu} {...$$restProps} on:m-focusout on:m-keydown on:m-pointermove>
		<slot builder={$subMenu} />
	</div>
{/if}
