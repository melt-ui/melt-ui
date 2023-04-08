<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogTriggerProps = BaseProps<HTMLButtonElement>;
</script>

<script lang="ts">
	type $$Props = DialogTriggerProps;

	const rootCtx = getDialogRootContext();
</script>

<!-- TODO: include aria-controls -->
<button
	aria-haspopup="dialog"
	aria-expanded={$rootCtx.open}
	data-state={getDataState($rootCtx.open)}
	on:click={() => {
		$rootCtx.open = !$rootCtx.open;
	}}
	{...$$restProps}
>
	<slot />
</button>
