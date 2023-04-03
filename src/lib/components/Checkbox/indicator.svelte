<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getCheckboxContext, getState } from './root.svelte';

	export type Props = BaseProps<HTMLSpanElement>;
</script>

<script lang="ts">
	import { isIndeterminate } from './root.svelte';

	type $$Props = Props;

	const { state, disabled } = getCheckboxContext();
</script>

{#if isIndeterminate($state) || !!$state}
	<span
		{...$$restProps}
		data-state={getState($state)}
		data-disabled={$disabled ? '' : undefined}
		style:pointer-events="none"
	>
		<slot />
	</span>
{/if}
