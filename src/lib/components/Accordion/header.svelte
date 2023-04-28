<script lang="ts" context="module">
	export type AccordionHeaderProps = BaseProps;
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';
	import { getItemContext } from './item.svelte';
	import { getRootCtx } from './root.svelte';

	type $$Props = AccordionHeaderProps;

	const rootCtx = getRootCtx();
	const itemCtx = getItemContext();

	$: isOpen = Array.isArray($rootCtx.value)
		? $rootCtx.value.includes($itemCtx.value)
		: $rootCtx.value === $itemCtx.value;
</script>

<h3
	data-state={isOpen ? 'open' : 'closed'}
	data-disabled={$rootCtx.disabled ? 'true' : undefined}
	{...$$restProps}
	use:useActions={$$restProps.use}
>
	<slot />
</h3>
