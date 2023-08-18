<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { ItemEvents, ItemProps } from '../types.js';
	import { disabledAttrs } from '../internal/helpers.js';

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let asChild: $$Props['asChild'] = false;
	export let disabled = false;
	const item = ctx.getMenu().elements.item;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot builder={$item} />
{:else}
	<div
		use:melt={$item}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerdown
		on:m-pointerleave
		on:m-pointermove
		{...disabledAttrs(disabled)}
	>
		<slot builder={$item} />
	</div>
{/if}
