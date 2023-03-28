<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, disabled } = getCollapsibleContext();
</script>

{#if $open}
	<div
		{...$$restProps}
		data-state={$open ? 'open' : 'closed'}
		data-disabled={$disabled ? 'true' : 'false'}
	>
		<slot />
	</div>
{/if}
