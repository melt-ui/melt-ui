<script lang="ts" context="module">
	export type AccordionTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { Collapsible } from '../Collapsible';
	import type { BaseProps } from '$lib/types';
	import { getItemContext } from './item.svelte';
	import { getAccordionContext } from './root.svelte';
	import { focus } from '$lib/helpers/dom';
	import { onMount } from 'svelte';

	type $$Props = AccordionTriggerProps;

	const { value: itemValue } = getItemContext();
	const { value: accordionValue, type, items } = getAccordionContext();

	const handleKeyDown = (e: KeyboardEvent) => {
		const target = e.target as HTMLElement;

		const currentIdx = $items.findIndex((item) => item.contains(target));

		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault();
				e.stopPropagation();
				focus($items[currentIdx + 1]?.querySelector('.accordion-trigger'));
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				e.stopPropagation();
				focus($items[currentIdx - 1]?.querySelector('.accordion-trigger'));
				break;
			}
			case 'Home': {
				e.preventDefault();
				e.stopPropagation();
				focus($items[0]?.querySelector('.accordion-trigger'));
				break;
			}
			case 'End': {
				e.preventDefault();
				e.stopPropagation();
				focus($items[$items.length - 1]?.querySelector('.accordion-trigger'));
				break;
			}
		}
	};

	let ref: HTMLElement;

	onMount(() => {
		items.update((v) => [...v, ref]);
	});
</script>

<div style:display="contents" bind:this={ref}>
	<Collapsible.Trigger
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
		on:keydown={handleKeyDown}
		{...$$restProps}
	>
		<slot />
	</Collapsible.Trigger>
</div>
