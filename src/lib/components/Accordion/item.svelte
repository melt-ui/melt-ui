<script lang="ts" context="module">
	import { newReactiveContext } from '$lib/internal/helpers/newReactiveContext';

	export type AccordionItemProps = CollapsibleRootProps & {
		value: string;
	};

	type ItemContext = {
		readonly value: string;
	};

	const { getContext, setContext } = newReactiveContext<ItemContext>();
	export const getItemContext = getContext;
</script>

<script lang="ts">
	import type { CollapsibleRootProps } from '../Collapsible';
	import { Collapsible } from '../index';
	import { getRootCtx } from './root.svelte';

	type $$Props = AccordionItemProps;

	export let value: string;

	const rootCtx = getRootCtx();

	$: isOpen = Array.isArray($rootCtx.value)
		? $rootCtx.value.includes(value)
		: $rootCtx.value === value;

	const itemCtx = setContext();
	$: itemCtx.set({ value });
</script>

<Collapsible.Root open={isOpen} disabled={$rootCtx.disabled} {...$$restProps}>
	<slot />
</Collapsible.Root>
