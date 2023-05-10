<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import { getDialogRootContext } from './root.svelte';

	export type DialogCloseProps = BaseProps<'button'>;
</script>

<script lang="ts">
	type $$Props = DialogCloseProps;
	export let use: $$Props['use'] = [];

	const rootCtx = getDialogRootContext();
</script>

<button
	on:click={() => {
		$rootCtx.open = false;
	}}
	{...$$restProps}
	use:useActions={use ?? []}
>
	<slot />
</button>
