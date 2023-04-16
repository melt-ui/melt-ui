<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';
	import { getDialogRootContext } from './root.svelte';

	export type DialogCloseProps = BaseProps<'button'>;
</script>

<script lang="ts">
	type $$Props = DialogCloseProps;

	const rootCtx = getDialogRootContext();
</script>

<button
	on:click={() => {
		$rootCtx.open = false;
	}}
	{...$$restProps}
>
	<slot />
</button>
