<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';
	export type SelectTriggerProps = BaseProps<'div'>;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';
	import { getSelectRootContext } from './root.svelte';

	type $$Props = SelectTriggerProps;
	export let use: $$Props['use'] = [];

	const rootCtx = getSelectRootContext();
</script>

<Popper.Anchor
	on:click={() => {
		$rootCtx.open = !$rootCtx.open;
	}}
	{...$$restProps}
	use={[...(use ?? [])]}
>
	<slot />
</Popper.Anchor>
