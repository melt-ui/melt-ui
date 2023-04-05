<script lang="ts" context="module">
	export type CollapsibleTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { useActions, type ActionArray } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { getRootContext } from './root.svelte';

	type $$Props = CollapsibleTriggerProps;

	export let use: ActionArray = [];

	const ctx = getRootContext();

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<button
	{...$$restProps}
	use:useActions={use}
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
