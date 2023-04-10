<script lang="ts" context="module">
	import { Portal } from '$lib/internal';
	import type { ComponentProps } from 'svelte';

	type PortalProps = ComponentProps<InstanceType<typeof Portal>>;
	export type DialogPortalProps = {
		container?: PortalProps['target'];
	};
</script>

<script lang="ts">
	import { getDialogRootContext } from './root.svelte';

	type $$Props = DialogPortalProps;

	export let container: $$Props['container'] = 'body';
	const rootCtx = getDialogRootContext();
</script>

{#if $rootCtx.open}
	<Portal target={container} {...$$restProps}>
		<slot />
	</Portal>
{/if}
