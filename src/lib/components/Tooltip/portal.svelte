<script lang="ts" context="module">
	type PortalProps = ComponentProps<InstanceType<typeof Portal>>;
	export type TooltipPortalProps = Omit<PortalProps, 'target'> & {
		container?: PortalProps['target'];
	};
</script>

<script lang="ts">
	import { Portal } from '$lib/internal/components';

	import type { ComponentProps } from 'svelte';
	import { getTooltipRootContext } from './root.svelte';
	import { browser } from '$app/environment';

	type $$Props = TooltipPortalProps;

	export let container: $$Props['container'] = 'body';

	const ctx = getTooltipRootContext();
</script>

{#if $ctx.open}
	<Portal target={container} {...$$restProps}>
		<slot />
	</Portal>
{/if}
