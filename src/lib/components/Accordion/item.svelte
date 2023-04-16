<script lang="ts" context="module">
	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';

	export type AccordionItemProps = CollapsibleRootProps & {
		value: string;
	};

	type ItemContext = {
		readonly value: string;
	};

	const { getContext, setContext } = reactiveContext<ItemContext>();
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

	const itemCtx = setContext({
		value: [value],
	});
	$: itemCtx.set({ value });
</script>

<Collapsible.Root open={isOpen} {...$$restProps}>
	<slot />
</Collapsible.Root>
