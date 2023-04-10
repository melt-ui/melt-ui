<script lang="ts" context="module">
	export type AccordionTriggerProps = BaseProps<'button'>;
</script>

<script lang="ts">
	import { useCollection } from '$lib/helpers/collectionContext';

	import type { BaseProps } from '$lib/types';
	import { Collapsible } from '../Collapsible';
	import { getItemContext } from './item.svelte';
	import { getRootCtx, getTriggerCollection } from './root.svelte';

	type $$Props = AccordionTriggerProps;

	const itemCtx = getItemContext();
	const rootCtx = getRootCtx();
	const triggerCollection = getTriggerCollection();
	let triggerIndex = 0;

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault();
				e.stopPropagation();
				$triggerCollection[triggerIndex + 1]?.focus();
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				e.stopPropagation();
				$triggerCollection[triggerIndex - 1]?.focus();
				break;
			}
			case 'Home': {
				e.preventDefault();
				e.stopPropagation();
				$triggerCollection[0]?.focus();
				break;
			}
			case 'End': {
				e.preventDefault();
				e.stopPropagation();
				$triggerCollection.at(-1)?.focus();
				break;
			}
		}
	};

	function onIndexChange(index: number) {
		triggerIndex = index;
	}
</script>

<Collapsible.Trigger
	use={[
		...($$restProps.use || []),
		[
			useCollection,
			{
				collection: triggerCollection,
				onIndexChange
			}
		]
	]}
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
>
	<slot />
</Collapsible.Trigger>
