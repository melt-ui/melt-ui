<script lang="ts" context="module">
	import { generateId } from '$lib/internal';
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogTriggerProps = BaseProps<'button'>;
</script>

<script lang="ts">
	type $$Props = DialogTriggerProps;

	const rootCtx = getDialogRootContext();
	const id = generateId();
</script>

<!-- TODO: include aria-controls -->
<button
	aria-haspopup="dialog"
	aria-expanded={$rootCtx.open}
	data-state={getDataState($rootCtx.open)}
	{id}
	on:click={() => {
		$rootCtx.open = !$rootCtx.open;
		$rootCtx.triggeredId = $rootCtx.open ? id : null;
	}}
	{...$$restProps}
>
	<slot />
</button>
