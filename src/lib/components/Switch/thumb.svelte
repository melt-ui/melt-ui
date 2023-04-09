<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getRootContext, getState } from './root.svelte';

	export type SwitchThumbProps = BaseProps<'span'>;
</script>

<script lang="ts">
	type $$Props = SwitchThumbProps;
	const rootCtx = getRootContext();
</script>

<span
	{...$$restProps}
	data-state={getState($rootCtx.checked)}
	data-disabled={$rootCtx.disabled ? '' : undefined}
/>
