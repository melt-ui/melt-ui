<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getRootContext, getState } from './root.svelte';

	export type Props = BaseProps;
</script>

<script lang="ts">
	type $$Props = Props;

	const ctx = getRootContext();
</script>

<div
	{...$$restProps}
	data-value={$ctx.value}
	data-max={$ctx.max}
	data-state={getState($ctx.value, $ctx.max)}
>
	<slot />
</div>
