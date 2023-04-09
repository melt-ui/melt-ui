<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getRootContext, getState } from './root.svelte';

	export type Props = BaseProps<'span'>;
</script>

<script lang="ts">
	import { isIndeterminate } from './root.svelte';

	type $$Props = Props;

	const ctx = getRootContext();
</script>

{#if isIndeterminate($ctx.checked) || !!$ctx.checked}
	<span
		{...$$restProps}
		data-state={getState($ctx.checked)}
		data-disabled={$ctx.disabled ? '' : undefined}
		style:pointer-events="none"
	>
		<slot />
	</span>
{/if}
