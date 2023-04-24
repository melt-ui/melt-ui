<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import { getSelectRootContext } from './root.svelte';

	export type SelectItemProps = BaseProps<'div'> & {
		value: string;
	};
</script>

<script lang="ts">
	type $$Props = SelectItemProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'];

	const rootCtx = getSelectRootContext();
</script>

<div
	on:click={() => {
		$rootCtx.value = value;
		$rootCtx.open = false;
	}}
	{...$$restProps}
	use:useActions={use ?? []}
>
	<slot name="text" />
	{#if $rootCtx.value === value}
		<slot name="indicator" />
	{/if}
</div>
