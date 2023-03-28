<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, disabled } = getCollapsibleContext();
</script>

<button
	{...$$restProps}
	on:click={() => {
		console.log('clicked', $open);
		open.update((v) => !v);
	}}
	data-state={$open ? 'open' : 'closed'}
	data-disabled={$disabled ? 'true' : undefined}
	disabled={$disabled}
>
	<slot />
</button>
