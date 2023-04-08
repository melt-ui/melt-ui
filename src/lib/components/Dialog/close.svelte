<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getDialogRootContext } from './root.svelte';

	export type DialogCloseProps = BaseProps<HTMLButtonElement>;
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
