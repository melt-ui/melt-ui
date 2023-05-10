<script lang="ts" context="module">
	import Portal, { type PortalProps } from '$lib/internal/components/Portal/Portal.svelte';

	export type SelectPortalProps = PortalProps;
</script>

<script lang="ts">
	type $$Props = SelectPortalProps;
	export let target: $$Props['target'] = 'body';
</script>

<Portal {target} {...$$restProps}>
	<slot />
</Portal>
