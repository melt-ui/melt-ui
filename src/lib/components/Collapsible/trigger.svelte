<script lang="ts">
	import type { BaseProps } from '$lib/types';
	import { getContext } from 'svelte';
	import { getCollapsibleContext } from './root.svelte';

	type $$Props = BaseProps;

	const { open, setOpen, disabled } = getCollapsibleContext();
</script>

<button {...$$restProps} on:click={() => setOpen(!$open)}>
	<slot />
</button>
