<script lang="ts" context="module">
	import { useActions } from '$lib/helpers/useActions';
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
	use:useActions={$$restProps.use}
	data-state={getState($rootCtx.checked)}
	data-disabled={$rootCtx.disabled ? '' : undefined}
/>
