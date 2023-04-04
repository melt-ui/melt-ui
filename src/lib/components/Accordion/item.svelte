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
	import { writable } from 'svelte/store';
	import { Collapsible } from '../index';
	import { getAccordionContext } from './root.svelte';

	type $$Props = AccordionItemProps;

	export let value: string;
	const writableValue = writable(value);
	$: if (value) $writableValue = value;

	const { value: accordionValue } = getAccordionContext();

	$: isOpen = $accordionValue === value;

	const setContextStores = setContext({
		value: [value, (v) => (value = v)]
	});
	$: setContextStores({ value });
</script>

<Collapsible.Root open={isOpen} {...$$restProps} data-radix-accordion-item>
	<slot />
</Collapsible.Root>
