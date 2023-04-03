<script lang="ts" context="module">
	import { uniqueContext } from '$lib/helpers/uniqueContext';

	export type AccordionItemProps = BaseProps & {
		value: string;
	};

	type ItemContext = {
		value: Writable<string>;
	};

	const { getContext, setContext } = uniqueContext<ItemContext>();
	export const getItemContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { writable, type Writable } from 'svelte/store';
	import { Collapsible } from '../index';
	import { getAccordionContext } from './root.svelte';

	type $$Props = AccordionItemProps;

	export let value: string;
	const writableValue = writable(value);
	$: if (value) $writableValue = value;

	const { value: accordionValue } = getAccordionContext();

	$: isOpen = $accordionValue === value;

	setContext({
		value: writableValue
	});
</script>

<Collapsible.Root open={isOpen} {...$$restProps}>
	<slot />
</Collapsible.Root>
