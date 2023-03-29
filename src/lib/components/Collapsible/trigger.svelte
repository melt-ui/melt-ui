<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, disabled } = getCollapsibleContext();

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<button
	{...$$restProps}
	on:click={() => {
		open.update((v) => {
			dispatch('change', !v);
			return !v;
		});
	}}
	data-state={$open ? 'open' : 'closed'}
	data-disabled={$disabled ? 'true' : undefined}
	disabled={$disabled}
>
	<slot />
</button>
