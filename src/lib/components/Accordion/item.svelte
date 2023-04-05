<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';

	export type AccordionItemProps = BaseProps & {
		value: string;
	};

	type ItemContext = {
		value: string;
	};

	const { getContext, setContext } = reactiveContext<ItemContext>();
	export const getItemContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { Collapsible } from '../index';
	import { getRootCtx } from './root.svelte';

	type $$Props = AccordionItemProps;

	export let value: string;

	const rootCtx = getRootCtx();

	$: isOpen = Array.isArray($rootCtx.value)
		? $rootCtx.value.includes(value)
		: $rootCtx.value === value;

	const itemCtx = setContext({
		value: [value, (v) => (value = v)]
	});
	$: itemCtx.set({ value });
</script>

<Collapsible.Root open={isOpen} {...$$restProps}>
	<slot />
</Collapsible.Root>
