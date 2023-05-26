<script lang="ts" context="module">
	import type { TooltipContentImplProps } from './internal/content-impl.svelte';
	import { getTooltipRootContext } from './root.svelte';

	export type TooltipContentProps = TooltipContentImplProps;
</script>

<script lang="ts">
	import ContentHoverable from './internal/content-hoverable.svelte';
	import ContentImpl from './internal/content-impl.svelte';

	type $$Props = TooltipContentProps;
	export let side: $$Props['side'] = 'top';

	const rootCtx = getTooltipRootContext();
</script>

{#if $rootCtx.disableHoverableContent}
	<ContentImpl {side} {...$$restProps}>
		<slot />
	</ContentImpl>
{:else}
	<ContentHoverable {side} {...$$restProps}>
		<slot />
	</ContentHoverable>
{/if}
