<script lang="ts" context="module">
	import { useActions } from '$lib/helpers/useActions';
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
		use:useActions={$$restProps.use}
		data-state={getState($ctx.checked)}
		data-disabled={$ctx.disabled ? '' : undefined}
		style:pointer-events="none"
	>
		<slot />
	</span>
{/if}
