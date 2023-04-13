<script lang="ts" context="module">
	import { useCollection } from '$lib/helpers/collectionContext';
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';
	import { getTriggerCollection } from './list.svelte';
	import { getTabsRootContext } from './root.svelte';

	export type TabsTriggerProps = BaseProps<'button'> & {
		value: string;
	};
</script>

<script lang="ts">
	type $$Props = TabsTriggerProps;

	export let value: $$Props['value'];

	const rootCtx = getTabsRootContext();
	const triggerCollection = getTriggerCollection();
	$: selected = $rootCtx.value === value;
</script>

<button
	data-state={selected ? 'active' : 'inactive'}
	data-orientation={$rootCtx.orientation}
	role="tab"
	tabindex={selected ? 0 : -1}
	on:click={() => ($rootCtx.value = value)}
	on:focus={() => {
		if ($rootCtx.activateOn === 'focus') {
			$rootCtx.value = value;
		}
	}}
	{...$$restProps}
	use:useActions={$$restProps.use}
	use:useCollection={{ collection: triggerCollection }}
>
	<slot />
</button>
