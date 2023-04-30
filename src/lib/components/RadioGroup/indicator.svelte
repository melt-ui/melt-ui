<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import { getRadioGroupItemContext } from './item.svelte';
	export type RadioGroupIndicatorProps = BaseProps<'span'>;
</script>

<script lang="ts">
	type $$Props = RadioGroupIndicatorProps;
	export let use: $$Props['use'] = [];

	const itemCtx = getRadioGroupItemContext();
</script>

{#if $itemCtx.checked}
	<span
		data-state={$itemCtx.checked ? 'checked' : 'unchecked'}
		data-disabled={$itemCtx.disabled ? '' : undefined}
		{...$$restProps}
		use:useActions={use ?? []}
	>
		<slot />
	</span>
{/if}
