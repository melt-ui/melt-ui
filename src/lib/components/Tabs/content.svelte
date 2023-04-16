<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';

	export type TabsContentProps = BaseProps<'div'> & {
		value: string;
	};
</script>

<script lang="ts">
	import { getTabsRootContext } from './root.svelte';

	type $$Props = TabsContentProps;

	export let value: $$Props['value'];

	const rootCtx = getTabsRootContext();
	$: selected = $rootCtx.value === value;
</script>

{#if selected}
	<div
		{...$$restProps}
		use:useActions={$$restProps.use}
		data-state={selected ? 'active' : 'inactive'}
		data-orientation={$rootCtx.orientation}
		role="tabpanel"
		tabindex="0"
	>
		<slot />
	</div>
{/if}
