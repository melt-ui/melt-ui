<script lang="ts" context="module">
	export type CollapsibleTriggerProps = BaseProps;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = CollapsibleTriggerProps;

	const ctx = getCollapsibleContext();

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<button
	{...$$restProps}
	on:click={() => {
		ctx.update((v) => {
			dispatch('change', !v.open);
			return { ...v, open: !v.open };
		});
	}}
	on:keydown
	data-state={$ctx.open ? 'open' : 'closed'}
	data-disabled={$ctx.disabled ? 'true' : undefined}
	disabled={$ctx.disabled}
>
	<slot />
</button>
