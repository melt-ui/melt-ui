<script lang="ts" context="module">
	export type CollapsibleTriggerProps = BaseProps & {
		asChild?: boolean;
	};
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';
	import { getCollapsibleRootContext } from './root.svelte';

	type $$Props = CollapsibleTriggerProps;
	export let asChild: $$Props['asChild'] = false;

	const ctx = getCollapsibleRootContext();
	$: trigger = $ctx?.trigger ?? {};
</script>

{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<button {...$$restProps} {...$trigger} use:useActions={$$restProps.use} type="button">
		<slot trigger={$trigger} />
	</button>
{/if}
