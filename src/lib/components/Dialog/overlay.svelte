<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getDataState } from './internal/helpers';
	import { getDialogRootContext } from './root.svelte';

	export type DialogOverlayProps = BaseProps<'div'>;
</script>

<script lang="ts">
	type $$Props = DialogOverlayProps;

	const rootCtx = getDialogRootContext();
	$: console.log('overlay', $rootCtx);
</script>

{#if $rootCtx.modal}
	<div data-state={getDataState($rootCtx.open)} {...$$restProps}>
		<slot />
	</div>
{/if}
