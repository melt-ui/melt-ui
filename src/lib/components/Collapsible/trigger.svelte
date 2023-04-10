<script lang="ts" context="module">
	export type CollapsibleTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { getRootContext } from './root.svelte';

	type $$Props = CollapsibleTriggerProps;

	const ctx = getRootContext();

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<button
	{...$$restProps}
	use:useActions={$$restProps.use}
	on:click={() => {
		$ctx.open = !$ctx.open;
		dispatch('change', $ctx.open);
	}}
	on:keydown
	data-state={$ctx.open ? 'open' : 'closed'}
	data-disabled={$ctx.disabled ? 'true' : undefined}
	disabled={$ctx.disabled}
>
	<slot />
</button>
