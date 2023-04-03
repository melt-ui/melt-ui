<script lang="ts" context="module">
	export type AccordionTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { Collapsible } from '../Collapsible';
	import type { BaseProps } from '$lib/types';
	import { getItemContext } from './item.svelte';
	import { getAccordionContext } from './root.svelte';

	type $$Props = AccordionTriggerProps;

	const { value: itemValue } = getItemContext();
	const { value: accordionValue, type } = getAccordionContext();
</script>

<Collapsible.Trigger
	{...$$restProps}
	on:change={(e) => {
		const value = e.detail;
		if ($type === 'single') {
			$accordionValue = value ? $itemValue : null;
		} else {
			const prevValue = Array.isArray($accordionValue) ? $accordionValue : [];
			$accordionValue = value
				? [...prevValue, $itemValue]
				: prevValue.filter((v) => v !== $itemValue);
		}
	}}
>
	<slot />
</Collapsible.Trigger>
