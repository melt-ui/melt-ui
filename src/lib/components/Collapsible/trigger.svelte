<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, setOpen, disabled } = getCollapsibleContext();
</script>

<button
	{...$$restProps}
	on:click={() => setOpen(!$open)}
	data-state={$open ? 'open' : 'closed'}
	data-disabled={disabled ? 'true' : undefined}
>
	<slot />
</button>
