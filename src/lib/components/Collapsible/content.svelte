<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open } = getCollapsibleContext();
</script>

{#if $open}
	<div {...$$restProps}>
		<slot />
	</div>
{/if}
