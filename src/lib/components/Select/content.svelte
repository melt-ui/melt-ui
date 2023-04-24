<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';
	export type SelectContentProps = BaseProps<'div'>;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';
	import { getSelectRootContext } from './root.svelte';
	import { dismissable } from '$lib/internal/actions';

	type $$Props = SelectContentProps;
	export let use: $$Props['use'] = [];

	const rootCtx = getSelectRootContext();
</script>

{#if $rootCtx.open}
	<Popper.Content
		{...$$restProps}
		use={[
			...(use ?? []),
			[
				dismissable,
				{
					onPointerDownDismiss: () => {
						$rootCtx.open = false;
					},
				},
			],
		]}
	>
		<slot />
	</Popper.Content>
{/if}
