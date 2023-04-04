<script lang="ts" context="module">
	export type AccordionTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { focus } from '$lib/helpers/dom';
	import type { BaseProps } from '$lib/types';
	import { Collapsible } from '../Collapsible';
	import { getItemContext } from './item.svelte';
	import { getAccordionContext } from './root.svelte';

	type $$Props = AccordionTriggerProps;

	const itemCtx = getItemContext();
	const rootCtx = getAccordionContext();

	const handleKeyDown = (e: KeyboardEvent) => {
		const target = e.target as HTMLElement;

		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault();
				e.stopPropagation();
				const nextItem = target.closest('[data-radix-accordion-item]')?.nextElementSibling;
				focus(nextItem?.querySelector('[data-radix-accordion-trigger]'));
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				e.stopPropagation();
				const prevItem = target.closest('[data-radix-accordion-item]')?.previousElementSibling;
				focus(prevItem?.querySelector('[data-radix-accordion-trigger]'));
				break;
			}
			case 'Home': {
				e.preventDefault();
				e.stopPropagation();
				const firstItem = target.closest('[data-radix-accordion-root]')?.firstElementChild;
				focus(firstItem?.querySelector('[data-radix-accordion-trigger]'));
				break;
			}
			case 'End': {
				e.preventDefault();
				e.stopPropagation();
				const lastItem = target.closest('[data-radix-accordion-root]')?.lastElementChild;
				focus(lastItem?.querySelector('[data-radix-accordion-trigger]'));
				break;
			}
		}
	};
</script>

<Collapsible.Trigger
	on:change={(e) => {
		const value = e.detail;
		if ($rootCtx.type === 'single') {
			$rootCtx.value = value ? $itemCtx.value : null;
		} else {
			const prevValue = Array.isArray($rootCtx.value) ? $rootCtx.value : [];
			$rootCtx.value = value
				? [...prevValue, $itemCtx.value]
				: prevValue.filter((v) => v !== $itemCtx.value);
		}
	}}
	on:keydown={handleKeyDown}
	{...$$restProps}
	data-radix-accordion-trigger
>
	<slot />
</Collapsible.Trigger>
