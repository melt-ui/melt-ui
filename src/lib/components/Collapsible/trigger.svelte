<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, disabled } = getCollapsibleContext();
</script>

<button
	{...$$restProps}
	on:click={() => ($open = !$open)}
	data-state={$open ? 'open' : 'closed'}
	data-disabled={$disabled ? 'true' : undefined}
	disabled={$disabled}
>
	<slot />
</button>
