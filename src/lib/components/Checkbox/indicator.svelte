<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers/useActions';
	import type { BaseProps } from '$lib/internal/types';
	import { getRootContext, getState } from './root.svelte';

	export type CheckboxIndicatorProps = BaseProps<'span'>;
</script>

<script lang="ts">
	import { isIndeterminate } from './root.svelte';

	type $$Props = CheckboxIndicatorProps;

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
