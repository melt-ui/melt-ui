<script lang="ts">
	import { Collapsible } from '../Collapsible';
	import type { BaseProps } from '$lib/types';
	import { getItemContext } from './item.svelte';
	import { getAccordionContext } from './root.svelte';

	type $$Props = BaseProps;

	const { value: itemValue } = getItemContext();
	const { value: accordionValue, type } = getAccordionContext();
</script>

<Collapsible.Trigger
	{...$$restProps}
	on:change={(v) => {
		if ($type === 'single') {
			$accordionValue = v ? $itemValue : null;
		}
	}}
>
	<slot />
</Collapsible.Trigger>
